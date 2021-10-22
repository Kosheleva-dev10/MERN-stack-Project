import React, { useState } from 'react';
import { Accordion, Button, Card, Dropdown, DropdownButton, Form, Image, Overlay, Popover } from 'react-bootstrap';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import AnswerInRow from './answer-in-row';
import { CustomTable } from '../common/table';
import { AnyTextInput } from '../common/text-input';
import { QuestionStatus } from '../../common/enums/questions';
import { connectAuth } from '../../common/redux/connects';
import { UserRole } from '../../common/enums/auth';
import { ConfirmPopover } from '../common/popover';

function QuestionInRow({
    history, onDelete, topicName, subTopicName,
    id, question, questionNumber, status,
    image, tableHeaders, tableData, answers, user
}) {
    const [isDetailOpened, setIsDetailOpened] = useState(false);

    const [removingQuestionId, setRemovingQuestionId] = useState(null);
    const [visibleConfirmPopover, setVisibleConfirmPopover] = useState(false);
    const [target, setTarget] = useState(null);

    const showDeleteQuestionConfirmPopover = (event, questionId) => {
        const dropDownTarget = event.target.parentNode.parentNode.firstChild;
        setTarget(dropDownTarget);
        setVisibleConfirmPopover(!visibleConfirmPopover);
        setRemovingQuestionId(questionId);
    };

    return (
        <div className='border-bottom border-gray lh-125 mb-0 pt-1'>
            <Accordion>
                <Card>
                    <Card.Header className='d-flex align-items-center'>
                        <div className='m-0 d-flex align-items-center'><strong className='mr-1'>[{questionNumber}]</strong> <AnyTextInput value={question} equation/></div>

                        <Accordion.Toggle as={FontAwesomeIcon} icon={faAngleDown} size='lg' eventKey='0'
                            className={classNames(['cursor-pointer', 'toggle-arrow', 'ml-auto'], {
                                'toggle-arrow-open': isDetailOpened
                            })} onClick={() => setIsDetailOpened(!isDetailOpened)}>
                            Click me!
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey='0'>
                        <Card.Body>
                            <DropdownButton variant='secondary' size='sm' title='Actions' className='text-right d-block'>
                                <Dropdown.Item disabled={user.role === UserRole.Admin && status === QuestionStatus.Published}
                                    onClick={() => history.push(`/admin/questions/edit/${id}`)}>Edit Entry</Dropdown.Item>
                                <Dropdown.Item disabled={user.role === UserRole.Admin && status === QuestionStatus.Published}
                                    onClick={(e) => showDeleteQuestionConfirmPopover(e, id)}>Delete Question</Dropdown.Item>
                            </DropdownButton>
                            <p><strong>Topic:</strong> {topicName}</p>
                            <p><strong>Sub Topic:</strong> {subTopicName}</p>
                            <div className='m-0 d-flex align-items-center'><AnyTextInput value={question} equation/></div>
                            {/* <p><strong>{question}</strong></p> */}

                            {!!image ? <Form.Row className='ml-3'><Image src={image} rounded style={{ height: 100, maxWidth: '100%' }} /></Form.Row> : null}

                            <CustomTable headers={tableHeaders} data={tableData} />

                            {answers.map((answer, ai) => <AnswerInRow key={ai} {...answer} />)}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

            <ConfirmPopover visible={visibleConfirmPopover} target={target} setVisibility={setVisibleConfirmPopover}
                label='Are you sure to delete this question?' onConfirm={() => { setVisibleConfirmPopover(false); onDelete(removingQuestionId); }}/>
        </div>
    );
};

QuestionInRow.propTypes = {
    id: PropTypes.string,
    examBodyId: PropTypes.string,
    examBodyName: PropTypes.string,
    examBodyLogoUrl: PropTypes.string,
    subjectId: PropTypes.string,
    subjectName: PropTypes.string,
    topicId: PropTypes.string,
    topicName: PropTypes.string,
    subTopicId: PropTypes.string,
    subTopicName: PropTypes.string,
    year: PropTypes.number,
    question: PropTypes.string,
    questionNumber: PropTypes.number,
    image: PropTypes.string,
    status: PropTypes.oneOf(Object.values(QuestionStatus)),
    tableHeaders: PropTypes.arrayOf(PropTypes.string),
    tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    answers: PropTypes.arrayOf(PropTypes.shape({
        correct: PropTypes.bool,
        value: PropTypes.string,
        image: PropTypes.string,
        tableHeaders: PropTypes.arrayOf(PropTypes.string),
        tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    })),
    onDelete: PropTypes.func
};

QuestionInRow.defaultProps = {
    id: '',
    examBodyId: '',
    examBodyName: '',
    examBodyLogoUrl: '',
    subjectId: '',
    subjectName: '',
    topicId: '',
    topicName: '',
    subTopicId: '',
    subTopicName: '',
    year: 1988,
    question: '',
    questionNumber: 1,
    image: '',
    status: QuestionStatus.Draft,
    tableHeaders: [],
    tableData: [],
    answers: [],
    onDelete: PropTypes.func
};

export default withRouter(connectAuth(QuestionInRow));
