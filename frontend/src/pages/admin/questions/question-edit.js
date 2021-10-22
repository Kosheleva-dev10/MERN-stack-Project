import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, FormControl, Image, InputGroup, Overlay, Popover, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faImage, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import QuestionsAPI from '../../../common/api/questions';
import SubTopicsAPI from '../../../common/api/sub-topics';
import UploadAPI from '../../../common/api/upload';
import { connectToasts } from '../../../common/redux/connects';
import { AnswerTable, EditableTable } from '../../../components/common/table';
import { ToastStatus } from '../../../common/enums/toast';
import { CustomSelect } from '../../../components/common/select';
import { QuestionStatus } from '../../../common/enums/questions';
import { ConfirmPopover } from '../../../components/common/popover';

const answerTableHeaders = ['Correct', 'Option', 'Actions']
const initQuestion = {
    id: '',
    question: '',
    questionNumber: 0,
    image: '',
    tableHeaders: [],
    tableData: []
};

function AdminQuestionsEdit({ history, match, addToastAction }) {
    const [topics, setTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [exam, setExam] = useState({
        examBodyId: '', examBodyName: '',
        subjectId: '', subjectName: '', year: 0
    });

    const [topicId, setTopicId] = useState('');
    const [subTopicId, setSubTopicId] = useState('');

    const fileInput = useRef(null);
    const [question, setQuestion] = useState(initQuestion);
    const [answers, setAnswers] = useState([]);

    const [assetToChange, setAssetToChange] = useState(null);
    const [tableMatrix, setTableMatrix] = useState({ rows: 0, columns: 0 });
    
    // New Table Popover
    const [newTableTarget, setNewTableTarget] = useState(null);
    const [visibleNewTablePopover, setVisibleNewTablePopover] = useState(false);

    // Confirm Popover
    const [visibleUpdateConfirmPopover, setVisibleUpdateConfirmPopover] = useState(false);
    const [updateConfirmTarget, setUpdateConfirmTarget] = useState(null);
    const [visibleClearEntryConfirmPopover, setVisibleClearEntryConfirmPopover] = useState(false);
    const [clearEntryConfirmTarget, setClearEntryConfirmTarget] = useState(null);
    useEffect(() => {
        const { questionId } = match.params;
        QuestionsAPI.initEditQuestionsPage(questionId).then(result => {
            setExam({
                examBodyName: result.question.examBodyName,
                subjectName: result.question.subjectName,
                year: result.question.year,
                examBodyId: result.question.examBodyId,
                subjectId: result.question.subjectId
            });
            setTopics(result.topics);
            if (result.topics.length > 0) {
                setTopicId(result.question.topicId);
            }
            setSubTopicId(result.question.subTopicId);
            setQuestion({
                id: result.question.id,
                question: result.question.question,
                questionNumber: result.question.questionNumber,
                image: result.question.image,
                tableHeaders: [].concat(result.question.tableHeaders),
                tableData: [].concat(result.question.tableData)
            });
            setAnswers([].concat(result.question.answers));
            console.log(result.question.answers);
        }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
    }, []);

    useEffect(() => {
        if (topicId) {
            SubTopicsAPI.getSubTopics(topicId).then(arrSubTopics => {
                setSubTopics(arrSubTopics);
                setSubTopicId(arrSubTopics[0].id);
            }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
        }
    }, [topicId]);

    const onChangeQuestion = (value, key) => { setQuestion({ ...question, [key]: value }); };
    const onUploadImage = index => {
        if (index < 0) {
            setAssetToChange('QUESTION');
        } else { setAssetToChange(`ANSWER-${index}`); }
        fileInput.current.click();
    };
    const onFileChanged = async e => {
        const { files } = e.target;
        if (files.length > 0) {
            const file = e.target.files[0];
            const fileName = await UploadAPI.uploadFile(file);
            if (!assetToChange) {
                return;
            }
            if (assetToChange.includes('ANSWER')) {
                const index = parseInt(assetToChange.split('-')[1]);
                const arrAnswers = JSON.parse(JSON.stringify(answers));
                arrAnswers[index].image = fileName
                setAnswers(arrAnswers);
            } else {
                onChangeQuestion(fileName, 'image');
            }
            e.target.value = '';
        }
    }
    const onChangeQuestionTableMatrix = (value, key) => { setTableMatrix({ ...tableMatrix, [key]: value }); }
    const onChangeQuestionTable = ({ content, type }) => {
        switch (type) {
            case 'HEADER':
                setQuestion({ ...question, tableHeaders: content });
                break;
            case 'DATA':
                setQuestion({ ...question, tableData: content });
                break;
            default:
                break;
        }
    }
    const onCreateQuestionTable = () => {
        setVisibleNewTablePopover(false)

        if (tableMatrix.columns < 1 || tableMatrix.rows < 1) {
            setQuestion({
                ...question,
                tableHeaders: [],
                tableData: []
            })
            return;
        }

        const newTableHeaders = JSON.parse(JSON.stringify(question.tableHeaders || []));
        const newTableData = JSON.parse(JSON.stringify(question.tableData || []));
        if (newTableHeaders.length > tableMatrix.columns) {
            newTableHeaders.length = tableMatrix.columns;
        } else {
            while (newTableHeaders.length < tableMatrix.columns) {
                newTableHeaders.push('');
            }
        }

        if (newTableData.length > tableMatrix.rows - 1) {
            newTableData.length = tableMatrix.rows - 1;
        } else {
            while (newTableData.length < tableMatrix.rows - 1) {
                newTableData.push([]);
            }
        }

        for (let i = 0; i < newTableData.length; i++) {
            const row = newTableData[i];
            if (row.length > tableMatrix.columns - 1) {
                row.length = tableMatrix.columns;
                continue;
            }
            while (row.length < tableMatrix.columns) {
                row.push('');
            }
        }

        setQuestion({
            ...question,
            tableHeaders: newTableHeaders,
            tableData: newTableData
        })
    };
    const onClickClearEntryButton = (event) => {
        setClearEntryConfirmTarget(event.target);
        setVisibleClearEntryConfirmPopover(true);
    };
    const clearQuestionEntry = () => { setAnswers([]); setQuestion(initQuestion); setVisibleClearEntryConfirmPopover(false); };
    const onClickUpdateButton = (event) => {
        setUpdateConfirmTarget(event.target);
        setVisibleUpdateConfirmPopover(true);
    };
    const updateQuestion = () => {
        setVisibleUpdateConfirmPopover(false);
        if (!question.question) {
            addToastAction('Warning', 'Need to set question.', ToastStatus.Warning)
            return;
        } else if (answers.length < 1) {
            addToastAction('Warning', 'Need to set answers for the question.', ToastStatus.Warning)
            return;
        }

        QuestionsAPI.updateQuestion({
            ...question, examBodyId: exam.examBodyId, subjectId: exam.subjectId, topicId, subTopicId, year: exam.year
        }, answers).then(response => {
            addToastAction('Success', 'The question is updated successfully.', ToastStatus.Success);
            // clearQuestionEntry();
        }, e => {
            addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger);
        });
    };
    const onShowNewTablePopover = (event) => {
        const preColumns = question.tableHeaders.length;
        const preRows = question.tableData.length + 1;
        setTableMatrix({ columns: preColumns, rows: preRows > 1 ? preRows : 0 })
        setNewTableTarget(event.target);
        setVisibleNewTablePopover(true);
    };

    // Answers
    const addAnswer = () => {
        setAnswers(answers.concat([{
            correct: false,
            answer: '',
            image: '',
            tableHeaders: [],
            tableData: []
        }]));
    };
    const onChangeAnswerTable = (value, index, type) => {
        const arrAnswers = JSON.parse(JSON.stringify(answers));
        switch (type) {
            case 'CORRECT':
                arrAnswers[index].correct = value;
                setAnswers(arrAnswers);
                break;
            case 'ANSWER':
                arrAnswers[index].answer = value;
                setAnswers(arrAnswers);
                break;
            case 'IMAGE-REMOVE':
                arrAnswers[index].image = '';
                setAnswers(arrAnswers);
                break;
            case 'IMAGE-UPLOAD':
                onUploadImage(index);
                break;
            case 'TABLE':
                for (const key of Object.keys(value)) {
                    const innerValue = value[key];
                    arrAnswers[index][key] = innerValue;
                }
                setAnswers(arrAnswers);
                break;
            case 'REMOVE':
                arrAnswers.splice(index, 1);
                setAnswers(arrAnswers);
                break;
            default:
                break;
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
                <h1 className='text-primary text-center'>Edit a Question</h1>
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
        <Row>
            <Col md={6} lg={4} className='ml-auto'>
                <Form.Group>
                    <Form.Label><strong>Question Number</strong></Form.Label>
                    <Form.Control type='text' placeholder='Enter Question Number' value={question.questionNumber}
                        onChange={e => onChangeQuestion(parseInt(e.target.value), 'questionNumber')} />
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col sm={12} className='d-flex'>
                <Form.Group className='flex-fill'>
                    <Form.Label><strong>Question</strong></Form.Label>
                    <Form.Control type='text' as='textarea' rows={3} placeholder='Enter Question' value={question.question}
                        onChange={e => onChangeQuestion(e.target.value, 'question')} />
                </Form.Group>
                <div className='ml-3 d-flex flex-column justify-content-end'>
                    <Form.Group className='mb-2'>
                        <FontAwesomeIcon className='cursor-pointer text-warning' size='lg' icon={faImage} onClick={() => onUploadImage(-1)} />
                    </Form.Group>
                    <Form.Group className='pb-3'>
                        <FontAwesomeIcon className='cursor-pointer text-info' size='lg' icon={faTable} onClick={(e) => onShowNewTablePopover(e)} />
                    </Form.Group>
                </div>
            </Col>

            {!question.image ? null : <Col sm={12}>
                <Image src={question.image} rounded style={{ height: 200, maxWidth: '100%' }} className='mb-3 rounded border border-gray p-1' />
                <FontAwesomeIcon className='cursor-pointer text-danger' size='lg' icon={faTimes}
                    style={{ marginLeft: -25, marginBottom: 87 }} onClick={() => setQuestion({ ...question, image: '' })} />
            </Col>}
            <Col sm={12}>
                <EditableTable headers={question.tableHeaders} data={question.tableData} onChange={onChangeQuestionTable} />
            </Col>
        </Row>
        <Row>
            <Col sm={12} className='px-0'>
                <Form.Group>
                    <Form.Label><strong>Answers</strong></Form.Label>
                    <FontAwesomeIcon className='ml-3 cursor-pointer text-success' icon={faPlus} onClick={addAnswer} />
                </Form.Group>
            </Col>

            <AnswerTable headers={answerTableHeaders} data={answers} onChange={onChangeAnswerTable} />
        </Row>
        <Row className='justify-content-between'>
            <Button variant='warning' onClick={onClickClearEntryButton}>Clear Entry</Button>
            <Button disabled={question.status === QuestionStatus.Published} onClick={onClickUpdateButton}>Update this Question</Button>
        </Row>
        <Form.File ref={fileInput} label='' className='d-none' onChange={onFileChanged} />

        <Overlay show={visibleNewTablePopover} target={newTableTarget} placement='left' onHide={() => setVisibleNewTablePopover(false)} containerPadding={20} rootClose>
            <Popover style={{ maxWidth: 200 }}>
                <Popover.Title as='h3' className='p-3'>Create a Table</Popover.Title>
                <Popover.Content>
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="question-table-columns">Columns</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Small" aria-describedby="question-table-columns" value={tableMatrix.columns}
                            onChange={e => onChangeQuestionTableMatrix(e.target.value, 'columns')} />
                    </InputGroup>
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="question-table-rows">Rows</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Small" aria-describedby="question-table-rows" value={tableMatrix.rows}
                            onChange={e => onChangeQuestionTableMatrix(e.target.value, 'rows')} />
                    </InputGroup>
                    <div className='d-flex justify-content-end'>
                        <Button size='sm' onClick={onCreateQuestionTable}>Create & Close</Button>
                    </div>
                </Popover.Content>
            </Popover>
        </Overlay>

        <ConfirmPopover visible={visibleUpdateConfirmPopover} target={updateConfirmTarget} placement='left' setVisibility={setVisibleUpdateConfirmPopover}
            label='Are you sure to update this question?' onConfirm={updateQuestion}/>

        <ConfirmPopover visible={visibleClearEntryConfirmPopover} target={clearEntryConfirmTarget} placement='right' setVisibility={setVisibleClearEntryConfirmPopover}
            label='Are you sure to clear entry?' onConfirm={clearQuestionEntry}/>
    </Container>
    );
};

AdminQuestionsEdit.propTypes = {};
AdminQuestionsEdit.defaultProps = {};

export default withRouter(connectToasts(AdminQuestionsEdit));
