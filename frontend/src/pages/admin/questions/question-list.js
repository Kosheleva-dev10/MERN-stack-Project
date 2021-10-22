import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';

import { CustomSelect } from '../../../components/common/select';
import { LoadingSpinner } from '../../../components/common/spinner';
import QuestionInRow from '../../../components/questions/question-in-row';

import QuestionsAPI from '../../../common/api/questions';
import SubTopicsAPI from '../../../common/api/sub-topics';
import { ToastStatus } from '../../../common/enums/toast';
import { connectAuth, connectToasts } from '../../../common/redux/connects';
import { QuestionStatus } from '../../../common/enums/questions';
import { UserRole } from '../../../common/enums/auth';
import { ConfirmPopover } from '../../../components/common/popover';

function AdminQuestionsList({ match, history, addToastAction, user }) {
    const [exam, setExam] = useState({
        examBodyId: '', examBodyName: '',
        subjectId: '', subjectName: '', year: 0
    });
    const [topics, setTopics] = useState([{ id: '', name: '- All Topics -' }]);
    const [subTopics, setSubTopics] = useState([{ id: '', name: '- All Sub Topics -' }]);
    const [topicId, setTopicId] = useState('');
    const [subTopicId, setSubTopicId] = useState('');

    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Confirm Popover
    const [visiblePublishConfirmPopover, setVisiblePublishConfirmPopover] = useState(false);
    const [publishConfirmTarget, setPublishConfirmTarget] = useState(null);
    const [visibleRequestToPublishConfirmPopover, setVisibleRequestToPublishConfirmPopover] = useState(false);
    const [requestToPublishConfirmTarget, setRequestToPublishConfirmTarget] = useState(null);

    useEffect(() => {
        const { examBodyId, subjectId, year } = match.params;
        setIsLoading(true);
        QuestionsAPI.initRegisterQuestionsPage(examBodyId, subjectId).then(result => {
            const { examBodyName, subjectName } = result;
            setExam({ examBodyName, subjectName, year: parseInt(year), examBodyId, subjectId });
            setTopics([{ id: '', name: '- All Topics -' }].concat(result.topics));
        }, e => {
            addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        onRefreshQuestionsList();
    }, [exam])

    useEffect(() => {
        if (topicId) {
            SubTopicsAPI.getSubTopics(topicId).then(arrSubTopics => {
                setSubTopics([{ id: '', name: '- All Sub Topics -' }].concat(arrSubTopics));
                if (!subTopicId) {
                    onRefreshQuestionsList();
                } else { setSubTopicId(''); }
            }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
        } else {
            setSubTopics([{ id: '', name: '- All Sub Topics -' }]);
            if (!subTopicId) {
                onRefreshQuestionsList();
            } else { setSubTopicId(''); }
        }
    }, [topicId]);

    useEffect(() => {
        onRefreshQuestionsList();
    }, [subTopicId])

    const onRefreshQuestionsList = () => {
        if (!exam.examBodyId || !exam.subjectId || !exam.year) { return; }

        setIsLoading(true);
        QuestionsAPI.findQuestionsByExam(
            exam.examBodyId,
            exam.subjectId,
            exam.year,
            { topicId, subTopicId, keyword: '' }
        ).then(qs => {
            setQuestions(qs);
            setIsLoading(false);
        }, e => {
            addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger);
            setIsLoading(false);
        });
    }

    const onClickRequestToPublishButton = (event) => {
        setRequestToPublishConfirmTarget(event.target);
        setVisibleRequestToPublishConfirmPopover(true);
    };

    const onRequestToPublish = () => {
        setVisibleRequestToPublishConfirmPopover(false);
        const { examBodyId, subjectId, year } = match.params;
        QuestionsAPI.requestToPublish(examBodyId, subjectId, parseInt(year)).then(result => {
            addToastAction('Success', 'Questions are requested to be published.', ToastStatus.Success);
            updateQuestionsStatus(QuestionStatus.UnderReview);
        }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
    };

    const onClickPublishQuestionsButton = (event) => {
        setPublishConfirmTarget(event.target);
        setVisiblePublishConfirmPopover(true);
    };

    const onPublishQuestions = () => {
        setVisiblePublishConfirmPopover(false);
        const { examBodyId, subjectId, year } = match.params;
        QuestionsAPI.publishQuestions(examBodyId, subjectId, parseInt(year)).then(result => {
            addToastAction('Success', 'Questions are requested to be published.', ToastStatus.Success);
            updateQuestionsStatus(QuestionStatus.Published);
        }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
    }

    const updateQuestionsStatus = (status) => {
        const newQuestions = JSON.parse(JSON.stringify(questions));
        for (const iterator of newQuestions) {
            iterator.status = status;
        }
        setQuestions(newQuestions);
    }

    const onDeleteQuestion = (id) => {
        QuestionsAPI.deleteQuestion(id).then(res => {
            const newQuestions = JSON.parse(JSON.stringify(questions));
            const index = newQuestions.findIndex(q => q.id === id);
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
    }

    const renderExaminationStatus = () => {
        if (questions.length < 1) {
            return null;
        }
        if (questions[0].status === QuestionStatus.Draft) {
            return <Alert variant='info'> Questions are in draft.</Alert>
        } else if (questions[0].status === QuestionStatus.UnderReview) {
            return <Alert variant='info'> Questions are under review.</Alert>
        } else {
            return <Alert variant='success'> Questions are already published.</Alert>
        }
    };

    const renderActionButtons = () => {
        if (questions.length < 1) {
            return null;
        }
        if (questions[0].status === QuestionStatus.Draft) {
            return <Button variant='info' disabled={isLoading} className='float-right' onClick={onClickRequestToPublishButton}>Request to Publish</Button>
        } else if (questions[0].status === QuestionStatus.UnderReview && user.role === UserRole.SuperAdmin) {
            return <Button variant='success' disabled={isLoading} className='float-right' onClick={onClickPublishQuestionsButton}>Publish Now</Button>
        } else {
            return null;
        }
    };

    return (<Container className='pt-4'>
        <Row>
            <Col>
                <Button variant='link' onClick={() => history.goBack()}>
                    <span className='h6'>Back</span>
                </Button>
            </Col>
        </Row>
        <Row className='mb-5'>
            <Col>
                <h1 className='text-center text-primary'>Questions List</h1>
            </Col>
        </Row>
        <Form>
            <Row>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label><strong>Exam Body</strong></Form.Label>
                        <Form.Control disabled type="text" placeholder="Exam Body" value={exam.examBodyName} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label><strong>Subject</strong></Form.Label>
                        <Form.Control disabled type="text" placeholder="Subject" value={exam.subjectName} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label><strong>Year</strong></Form.Label>
                        <Form.Control disabled type="text" placeholder="Year" value={exam.year} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={5}><CustomSelect label='Topic' values={topics} value={topicId} onChange={e => setTopicId(e.target.value)} /></Col>
                <Col md={7}><CustomSelect label='Sub Topic' values={subTopics} value={subTopicId} onChange={e => setSubTopicId(e.target.value)} /></Col>
            </Row>
        </Form>
        <Row className='mt-5 mb-3'>
            <Col>
                {renderExaminationStatus()}
                {renderActionButtons()}
            </Col>
        </Row>
        <Row className='justify-content-center'>
            {isLoading ?
                <LoadingSpinner /> :
                questions.map((question, qi) => <Col sm={12} key={qi}><QuestionInRow {...question} onDelete={onDeleteQuestion} /></Col>)
            }
        </Row>

        <ConfirmPopover visible={visiblePublishConfirmPopover} target={publishConfirmTarget} setVisibility={setVisiblePublishConfirmPopover}
            label='Are you sure to publish questions?' onConfirm={onPublishQuestions}/>

        <ConfirmPopover visible={visibleRequestToPublishConfirmPopover} target={requestToPublishConfirmTarget}
            setVisibility={setVisibleRequestToPublishConfirmPopover} label='Are you sure to request these questions to publish?' onConfirm={onRequestToPublish}/>
    </Container >);
};

AdminQuestionsList.propTypes = {};
AdminQuestionsList.defaultProps = {};

export default withRouter(connectToasts(connectAuth(AdminQuestionsList)));
