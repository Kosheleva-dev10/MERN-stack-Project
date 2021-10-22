import React, { useEffect, useState } from 'react';
import { Button, Col, Container, FormControl, Image, InputGroup, Modal, Overlay, Pagination, Popover, Row, Table } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons';

import { CustomSelect } from '../../../components/common/select';
import { LoadingSpinner } from '../../../components/common/spinner';

import QuestionsAPI from '../../../common/api/questions';
import ExamBodyAPI from '../../../common/api/exam-bodies';
import SubjectsAPI from '../../../common/api/subjects';
import { connectAuth, connectToasts } from '../../../common/redux/connects';
import { UserRole } from '../../../common/enums/auth';
import { QuestionStatus } from '../../../common/enums/questions';
import { ToastStatus } from '../../../common/enums/toast';
import { ConfirmPopover } from '../../../components/common/popover';

const questionGroupTableHeaders = ['Year', 'Subject', 'Question Count', 'Status', 'Actions'];

function AdminQuestionGroups({ match, history, user, addToastAction }) {
    //Current Exam Body
    const [examBody, setExamBody] = useState({ id: '', name: '', logoUrl: '' });
    // Necessary Arrays
    const [questionGroups, setQuestionGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [years, setYears] = useState([]);

    // Create new Question Group
    const [newQuestionGroupInput, setNewQuestionGroupInput] = useState({
        subjectId: '',
        year: new Date().getFullYear()
    });

    // Admin Filtering by Subject, Year, Status
    const [filterCategories, setFilterCategories] = useState({
        subjects: [{ id: '', name: '- All Subjects -' }],
        years: [{ id: 0, name: '- All Years -' }],
        statuses: [{ id: '', name: '- All Subjects -' }]
    })
    const [filterOptions, setFilterOptions] = useState({
        subjectId: '',
        year: 0,
        status: ''
    });

    // Additional Details
    const [selectedQuestionGroup, setSelectedQuestionGroup] = useState(null);
    const [visibleAdditionalDetails, setVisibleAdditionalDetails] = useState(false);

    // OverLay
    const [actionIndex, setActionIndex] = useState(-1);
    const [visibleActionPopover, setVisibleActionPopover] = useState(false);
    const [actionTarget, setActionTarget] = useState(null);
    const [visibleNewExamPopover, setVisibleNewExamPopover] = useState(false);
    const [newExamTarget, setNewExamTarget] = useState(null);

    // Pagination
    const [pageIndex, setPageIndex] = useState(0);
    const [total, setTotal] = useState({ pagesCount: 1, groupsCount: 0 });

    // Confirm Popover
    const [visiblePublishConfirmPopover, setVisiblePublishConfirmPopover] = useState(false);
    const [publishConfirmTarget, setPublishConfirmTarget] = useState(null);
    const [visibleRequestToPublishConfirmPopover, setVisibleRequestToPublishConfirmPopover] = useState(false);
    const [requestToPublishConfirmTarget, setRequestToPublishConfirmTarget] = useState(null);

    // Loading Status
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const { examBodyId } = match.params;
        ExamBodyAPI.getExamBodyById(examBodyId).then(eb => setExamBody(eb), e => console.log(e));
        SubjectsAPI.getAllSubjects().then(arrSubjects => {
            setSubjects(arrSubjects);
            const newYears = [];
            for (let i = 1988; i < new Date().getFullYear(); i++) {
                newYears.push(i);
            }
            setYears(newYears);

            setNewQuestionGroupInput({ ...newQuestionGroupInput, subjectId: arrSubjects[0].id, year: newYears[0] });

            const newStatuses = [{ id: '', name: '- All Statuses -' }];
            for (const value of Object.values(QuestionStatus)) {
                newStatuses.push({ id: value, name: String(value).split('-').join(' ') });
            }

            setFilterCategories({
                subjects: [{ id: '', name: '- All Subjects -' }].concat(arrSubjects.map(subject => ({ id: subject.id, name: subject.name }))),
                years: [{ id: 0, name: '- All Years -' }].concat(newYears.map(year => ({ id: year, name: `${year}` }))),
                statuses: newStatuses
            });
        }, e => {
            console.log(e);
        });
    }, []);

    useEffect(() => {
        if (!pageIndex) {
            onRefreshQuestionGroups();
        } else {
            setPageIndex(0);
        }
    }, [filterOptions]);

    useEffect(() => {
        onRefreshQuestionGroups();
    }, [pageIndex]);

    const getSubjectNameWithId = (id) => {
        const subject = subjects.find(s => s.id === id);
        if (subject) { return subject.name; }
        return '';
    };

    // Actions Popover
    const toggleActionPopover = (event, index) => {
        setActionIndex(index);
        setActionTarget(event.target);
        let objTimeOut = setTimeout(() => {
            clearTimeout(objTimeOut);
            setVisibleActionPopover(true);
            setVisibleNewExamPopover(false);
        }, 100);

    };

    const onViewAdditionalDetails = () => {
        const { examBodyId } = match.params;
        const qGroup = questionGroups[actionIndex];
        setVisibleActionPopover(false);
        if (qGroup.count < 1) {
            addToastAction('Info', 'Nothing to show additional details.', ToastStatus.Info);
            return;
        }
        const subject = subjects.find(subject => subject.id === qGroup.subjectId);
        QuestionsAPI.findAdditionalDetails(examBodyId, qGroup.subjectId, qGroup.year).then(result => {
            const { createdByFullName, lastModifiedByFullName } = result;
            setSelectedQuestionGroup(Object.assign({
                createdBy: createdByFullName,
                lastModifiedBy: lastModifiedByFullName,
                subjectName: subject.name
            }, qGroup));
            setVisibleAdditionalDetails(true);
        }, e => console.log(e));
    };

    const onAddNewQuestion = () => {
        const { examBodyId } = match.params;
        const qGroup = questionGroups[actionIndex];
        const { subjectId, year } = qGroup;
        setVisibleActionPopover(false);
        history.push(`/admin/questions/add/${examBodyId}/${subjectId}/${year}`);
    };

    const onViewAllQuestions = () => {
        const { examBodyId } = match.params;
        const qGroup = questionGroups[actionIndex];
        const { subjectId, year } = qGroup;
        setVisibleActionPopover(false);
        if (qGroup.count < 1) {
            addToastAction('Info', 'No questions to show.', ToastStatus.Info);
            return;
        }
        history.push(`/admin/questions/view/${examBodyId}/${subjectId}/${year}`);
    };

    const onClickPublishQuestionGroupButton = (event) => {
        setPublishConfirmTarget(event.target);
        setVisiblePublishConfirmPopover(true);
    }
    const onPublishQuestionGroup = () => {
        setVisiblePublishConfirmPopover(false);
        const { examBodyId } = match.params;
        const qGroup = questionGroups[actionIndex];
        setVisibleActionPopover(false);
        if (qGroup.count < 1) {
            addToastAction('Info', 'Nothing to Publish.', ToastStatus.Info);
            return;
        }
        QuestionsAPI.publishQuestions(examBodyId, qGroup.subjectId, qGroup.year).then(result => {
            updateQuestionGroupStatus(actionIndex, QuestionStatus.Published);
            addToastAction('Success', 'Questions are published successfully.', ToastStatus.Success);
        }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
    };

    const onClickRequestToPublishQuestionGroupButton = (event) => {
        setRequestToPublishConfirmTarget(event.target);
        setVisibleRequestToPublishConfirmPopover(true);
    };
    const onRequestToPublishQuestionGroup = () => {
        setVisibleRequestToPublishConfirmPopover(false);
        const { examBodyId } = match.params;
        const qGroup = questionGroups[actionIndex];
        setVisibleActionPopover(false);
        if (qGroup.count < 1) {
            addToastAction('Info', 'Nothing to Review.', ToastStatus.Info);
            return;
        }
        QuestionsAPI.requestToPublish(examBodyId, qGroup.subjectId, qGroup.year).then(result => {
            updateQuestionGroupStatus(actionIndex, QuestionStatus.UnderReview);
            addToastAction('Success', 'Questions are requested to be published.', ToastStatus.Success);
        }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
    };

    const updateQuestionGroupStatus = (groupIndex, status) => {
        const newGroups = JSON.parse(JSON.stringify(questionGroups));
        const qGroup = newGroups[groupIndex];
        qGroup.status = status;
        setQuestionGroups(newGroups);
    }

    // Add new Question Group
    const onAddNewQuestionGroup = () => {
        const index = questionGroups.findIndex(qGroup => qGroup.year === newQuestionGroupInput.year && qGroup.subjectId === newQuestionGroupInput.subjectId);
        setVisibleNewExamPopover(false);
        if (index >= 0) {
            addToastAction('Error', 'Specific Exam is already registered.', ToastStatus.Warning);
            return;
        }
        setQuestionGroups(questionGroups.concat([{
            count: 0,
            subjectId: newQuestionGroupInput.subjectId,
            year: newQuestionGroupInput.year,
            status: QuestionStatus.Draft
        }]));
    };
    const onChangeNewQuestionGroupInputs = (value, field) => {
        setNewQuestionGroupInput({ ...newQuestionGroupInput, [field]: value });
    };

    // Filter Options
    const onChangeFilterOptions = (value, field) => {
        setFilterOptions({ ...filterOptions, [field]: value });
    };
    const onRefreshQuestionGroups = () => {
        const { examBodyId } = match.params;
        setIsLoading(true);
        QuestionsAPI.findQuestionGroups(examBodyId, { ...filterOptions, pageIndex }).then(response => {
            const { count, questionGroups } = response;
            setTotal({
                groupsCount: count,
                pagesCount: Math.ceil(count / 10) // 10 is default limit per page
            });
            setQuestionGroups(questionGroups);
            setIsLoading(false);
        }, e => {
            console.log(e);
            setIsLoading(false);
        });
    };
    const onShowNewExamPopover = (event) => {
        setNewExamTarget(event.target);
        setVisibleNewExamPopover(true);
        setVisibleActionPopover(false);
    }

    const renderPublishActionsDropDownItem = () => {
        const qGroup = questionGroups[actionIndex];
        if (!qGroup) { return null; }
        if (qGroup.status === QuestionStatus.UnderReview && user.role === UserRole.SuperAdmin) {
            return <Button className='my-1' variant='link' size='sm' disabled={user.role !== UserRole.SuperAdmin} onClick={onClickPublishQuestionGroupButton}>Publish Questions</Button>;
        } else if (qGroup.status === QuestionStatus.Draft) {
            return <Button className='my-1' variant='link' size='sm' onClick={onClickRequestToPublishQuestionGroupButton}>Request to Publish</Button>;
        }
        return null;
    }
    const renderAddNewQuestionDropDownItem = () => {
        const qGroup = questionGroups[actionIndex];
        if (!qGroup) { return null; }
        if (qGroup.status !== QuestionStatus.Published) {
            return <Button className='my-1' variant='link' size='sm' onClick={onAddNewQuestion}>
                Add New Question
        </Button>;
        }
        return null;
    }

    return (<Container className='pt-4'>
        <Row>
            <Col>
                <Button variant='link' onClick={() => history.goBack()}>
                    <span className='h6'>Back</span>
                </Button>
            </Col>
        </Row>
        <Row className='mb-3'>
            <Col>
                <h1 className='text-primary text-center'>Examinations</h1>
            </Col>
        </Row>
        <Row>
            <Col sm={12}>
                <h4>Filter Options</h4>
            </Col>
            <Col md={4}>
                <CustomSelect label='Year' values={filterCategories.years} value={filterOptions.year} onChange={(e) => onChangeFilterOptions(parseInt(e.target.value), 'year')} />
            </Col>
            <Col md={4}>
                <CustomSelect label='Subject' values={filterCategories.subjects} value={filterOptions.subjectId} onChange={(e) => onChangeFilterOptions(e.target.value, 'subjectId')} />
            </Col>
            <Col md={4}>
                <CustomSelect label='Status' values={filterCategories.statuses} value={filterOptions.status} onChange={(e) => onChangeFilterOptions(e.target.value, 'status')} />
            </Col>
        </Row>
        <Row className='align-items-center'>
            <Image src={examBody.logoUrl} style={{ height: 60 }} className='d-inline ml-3' rounded />
            <h4 className='ml-2 d-inline'>{examBody.name}</h4>
            {isLoading ?
                <LoadingSpinner /> :
                <FontAwesomeIcon className='cursor-pointer ml-auto mr-3 text-success float-right' icon={faPlus} onClick={(e) => onShowNewExamPopover(e)} size='lg' />
            }
        </Row>
        <Row>
            <Col className='text-right'>
                <h5 className='ml-auto'>({total.groupsCount} Examinations)</h5>
            </Col>
        </Row>
        {!isLoading && questionGroups.length < 1 ?
            <h3 className='text-center'>No Questions found</h3> :
            <Table responsive bordered>
                <thead><tr>
                    {questionGroupTableHeaders.map((headerName, hi) => <th key={hi}>{headerName}</th>)}
                </tr></thead>
                <tbody>
                    {questionGroups.map((qGroup, qgi) => <tr key={qgi}>
                        <td style={{ width: 100 }}>{qGroup.year}</td>
                        <td>{getSubjectNameWithId(qGroup.subjectId)}</td>
                        <td style={{ width: 180 }}>{qGroup.count}</td>
                        <td style={{ width: 180 }}>
                            <span className='text-capitalize'>{String(qGroup.status).split('-').join(' ').toLowerCase()}</span>
                        </td>
                        <td style={{ width: 100 }}>
                            <FontAwesomeIcon className='cursor-pointer' icon={faBars} onClick={(e) => toggleActionPopover(e, qgi)} size='lg' />
                        </td>
                    </tr>)}
                </tbody>
            </Table>
        }
        <Row className='justify-content-end'>
            <Col>
                <Pagination className='float-right'>
                    <Pagination.First disabled={pageIndex <= 0} onClick={() => setPageIndex(0)} />
                    <Pagination.Prev disabled={pageIndex <= 0} onClick={() => setPageIndex(pageIndex - 1)} />
                    <Pagination.Item active>{pageIndex + 1}</Pagination.Item>
                    <Pagination.Next disabled={pageIndex >= total.pagesCount - 1} onClick={() => setPageIndex(pageIndex + 1)} />
                    <Pagination.Last disabled={pageIndex >= total.pagesCount - 1} onClick={() => setPageIndex(total.pagesCount - 1)} />
                </Pagination>
            </Col>
        </Row>

        {!selectedQuestionGroup ? null :
            <Modal show={visibleAdditionalDetails} onHide={() => setVisibleAdditionalDetails(false)}
                backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Additional Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-year">Year</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Year" aria-label="Year" aria-describedby="sqgroup-year" value={selectedQuestionGroup.year} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-subject">Subject</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Subject" aria-label="Subject" aria-describedby="sqgroup-subject" value={selectedQuestionGroup.subjectName} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-status">Status</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Status" aria-label="Status" aria-describedby="sqgroup-status" value={selectedQuestionGroup.status} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-qcount">Question Count</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Question Count" aria-label="Question Count" aria-describedby="sqgroup-qcount" value={selectedQuestionGroup.count} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-created-at">Created At</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Created At" aria-label="Created At" aria-describedby="sqgroup-created-at" value={selectedQuestionGroup.createdAt} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-created-by">Created By</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Created By" aria-label="Created By" aria-describedby="sqgroup-created-by" value={selectedQuestionGroup.createdBy} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-last-modified-at">Last Modifed At</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Last Modifed At" aria-label="Last Modifed At" aria-describedby="sqgroup-last-modified-at" value={selectedQuestionGroup.lastModifiedAt} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="sqgroup-last-modified-by">Last Modified By</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl disabled placeholder="Last Modified By" aria-label="Last Modified By" aria-describedby="sqgroup-last-modified-by" value={selectedQuestionGroup.lastModifiedBy} />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setVisibleAdditionalDetails(false)}>Close</Button>
                </Modal.Footer>
            </Modal>}

        <Overlay show={visibleActionPopover} target={actionTarget} placement='left' onHide={() => setVisibleActionPopover(false)} containerPadding={20} rootClose>
            <Popover style={{ maxWidth: 200 }}>
                <Popover.Title as='h3' className='p-3'>Actions</Popover.Title>
                <Popover.Content>
                    <Button className='my-1' variant='link' size='sm' onClick={onViewAdditionalDetails}>
                        View Additional Details
                    </Button>
                    {renderAddNewQuestionDropDownItem()}
                    <Button className='my-1' variant='link' size='sm' onClick={onViewAllQuestions}>
                        View All Questions
                    </Button>
                    {renderPublishActionsDropDownItem()}
                </Popover.Content>
            </Popover>
        </Overlay>

        <Overlay show={visibleNewExamPopover} target={newExamTarget} placement='left' onHide={() => setVisibleNewExamPopover(false)} containerPadding={20} rootClose>
            <Popover style={{ maxWidth: 200 }}>
                <Popover.Title as='h3' className='p-3'>New Examination</Popover.Title>
                <Popover.Content>
                    <CustomSelect label='Year' values={years} value={newQuestionGroupInput.year} onChange={e => onChangeNewQuestionGroupInputs(parseInt(e.target.value), 'year')} />
                    <CustomSelect label='Subject' values={subjects} value={newQuestionGroupInput.subjectId} onChange={e => onChangeNewQuestionGroupInputs(e.target.value, 'subjectId')} />
                    <div className='d-flex justify-content-end'>
                        <Button size='sm' className='mb-2' onClick={onAddNewQuestionGroup}>Create & Close</Button>
                    </div>
                </Popover.Content>
            </Popover>
        </Overlay>

        <ConfirmPopover visible={visiblePublishConfirmPopover} target={publishConfirmTarget} setVisibility={setVisiblePublishConfirmPopover}
            label='Are you sure to publish questions?' onConfirm={onPublishQuestionGroup}/>

        <ConfirmPopover visible={visibleRequestToPublishConfirmPopover} target={requestToPublishConfirmTarget}
            setVisibility={setVisibleRequestToPublishConfirmPopover} label='Are you sure to request this question group to publish?' onConfirm={onRequestToPublishQuestionGroup}/>

    </Container>);
};

AdminQuestionGroups.propTypes = {};
AdminQuestionGroups.defaultProps = {};

export default withRouter(connectAuth(connectToasts(AdminQuestionGroups)));
