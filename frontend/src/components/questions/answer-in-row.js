import React from 'react';
import PropTypes from 'prop-types';
import { Form, Image } from 'react-bootstrap';

import { CustomTable } from '../common/table';
import { AnyTextInput } from '../common/text-input';

function AnswerInRow({ correct, answer, image, tableHeaders, tableData }) {
    return (<Form className='pb-3'>
        <Form.Check className='d-flex align-items-center' type="checkbox" checked={correct} onChange={() => {}} label={<AnyTextInput value={answer} equation/>} />

        {!!image ? <Form.Row className='ml-3'><Image src={image} rounded style={{ height: 100, maxWidth: '100%' }} /></Form.Row> : null}

        {(!!tableHeaders && !!tableHeaders.length) ? <CustomTable headers={tableHeaders} data={tableData}/> : null}
    </Form>);
};

AnswerInRow.propTypes = {
    correct: PropTypes.bool,
    answer: PropTypes.string,
    image: PropTypes.string,
    tableHeaders: PropTypes.arrayOf(PropTypes.string),
    tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
AnswerInRow.defaultProps = {
    correct: false,
    answer: '',
    image: '',
    tableHeaders: [],
    tableData: []
};

export default AnswerInRow;
