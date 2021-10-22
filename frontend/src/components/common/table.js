import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Button, Form, FormControl,
    Image, InputGroup, Overlay,
    Popover, Table
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faImage, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

import { AnyTextInput } from './text-input';

export const EditableTable = ({ headers, data, onChange }) => {
    const onChangeDataCell = (value, rowIndex, colIndex) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[rowIndex][colIndex] = value;
        onChange({ content: newData, type: 'DATA' });
    };

    const onChangeHeaderCell = (value, colIndex) => {
        const newHeader = JSON.parse(JSON.stringify(headers));
        newHeader[colIndex] = value;
        onChange({ content: newHeader, type: 'HEADER' });
    };

    return (
        <Table responsive bordered>
            <thead><tr>
                {headers.map((headerName, hi) => <th key={hi}>
                    <Form.Control variant='dark' type="text" value={headerName} onChange={e => onChangeHeaderCell(e.target.value, hi)} />
                </th>)}
            </tr></thead>
            <tbody>
                {data.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}>
                    <Form.Control type="text" value={cell} onChange={e => onChangeDataCell(e.target.value, ri, ci)} />
                </td>)}</tr>)}
            </tbody>
        </Table>
    );
};

export const CustomTable = ({ headers, data, responsive, striped, bordered, hover }) => {
    return (
        <Table responsive={responsive} striped={striped} bordered={bordered} hover={hover}>
            <thead><tr>
                {headers.map((headerName, hi) => <th key={hi}><AnyTextInput value={headerName} equation/></th>)}
            </tr></thead>
            <tbody>
                {data.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}><AnyTextInput value={cell} equation/></td>)}</tr>)}
            </tbody>
        </Table>
    );
};

CustomTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    responsive: PropTypes.bool,
    striped: PropTypes.bool,
    bordered: PropTypes.bool,
    hover: PropTypes.bool
};
CustomTable.defaultProps = {
    headers: [],
    data: [],
    responsive: true,
    striped: false,
    bordered: true,
    hover: false
};

export const AnswerTable = ({ headers, data, onChange }) => {
    const [tableMatrix, setTableMatrix] = useState({ rows: 0, columns: 0 });

    const [visibleNewTablePopover, setVisibleNewTablePopover] = useState(false);
    const [newTableTarget, setNewTableTarget] = useState(null);
    const [newTableIndex, setNewTableIndex] = useState(-1);

    const onChangeMatrixField = (value, field) => {
        setTableMatrix({ ...tableMatrix, [field]: value });
    };

    const onCreateTable = () => {
        setVisibleNewTablePopover(false);

        if (tableMatrix.columns < 1 || tableMatrix.rows < 1) {
            onChange({
                tableHeaders: [],
                tableData: []
            }, newTableIndex, 'TABLE');
            return;
        }

        const newTableHeaders = JSON.parse(JSON.stringify(data[newTableIndex].tableHeaders || []));
        const newTableData = JSON.parse(JSON.stringify(data[newTableIndex].tableData || []));
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

        onChange({
            tableHeaders: newTableHeaders,
            tableData: newTableData
        }, newTableIndex, 'TABLE');
    };

    const onChangeAnswerTable = ({ content, type, answerIndex }) => {
        switch (type) {
            case 'HEADER':
                onChange({ tableHeaders: content }, answerIndex, 'TABLE');
                break;
            case 'DATA':
                onChange({ tableData: content }, answerIndex, 'TABLE');
                break;
            default:
                break;
        }
    }

    const onShowNewTablePopover = (event, index) => {
        setNewTableIndex(index);
        setNewTableTarget(event.target);
        const preColumns = data[index].tableHeaders.length;
        const preRows = data[index].tableData.length + 1;
        setTableMatrix({ columns: preColumns, rows: preRows > 1 ? preRows : 0 })
        let objTimeout = setTimeout(() => {
            clearTimeout(objTimeout);
            setVisibleNewTablePopover(true);
        }, 100);
    }

    return (<Table responsive bordered>
        <thead><tr>
            {headers.map((headerName, hi) => <th key={hi}>{headerName}</th>)}
        </tr></thead>
        <tbody>
            {data.map((row, ri) => <tr key={ri}>
                <td width={80}>
                    <Form.Check className='form-check-lg d-flex justify-content-center' type="checkbox"
                        checked={row.correct} onChange={e => onChange(e.target.checked, ri, 'CORRECT')} />
                </td>
                <td>
                    <Form.Control type="text" placeholder="Enter Answer" value={row.answer} className='mb-2'
                        onChange={e => onChange(e.target.value, ri, 'ANSWER')} />
                    {!row.image ? null : <Fragment>
                        <Image src={row.image} rounded style={{ height: 150, maxWidth: '100%' }} className='mb-2' />
                        <FontAwesomeIcon className='cursor-pointer text-danger' size='lg' icon={faTimes}
                            style={{ marginLeft: -25, marginBottom: 60 }} onClick={() => onChange(null, ri, 'IMAGE-REMOVE')} />
                    </Fragment>}
                    <EditableTable headers={row.tableHeaders} data={row.tableData} onChange={p => onChangeAnswerTable({ ...p, answerIndex: ri })} />
                </td>
                <td width={120}>
                    <FontAwesomeIcon className='cursor-pointer text-warning' size='lg' icon={faImage} onClick={() => onChange(null, ri, 'IMAGE-UPLOAD')} />
                    <FontAwesomeIcon className='cursor-pointer text-info ml-1' size='lg' icon={faTable} onClick={(e) => onShowNewTablePopover(e, ri)} />
                    <FontAwesomeIcon className='cursor-pointer text-danger ml-4' size='lg' icon={faTrash} onClick={() => onChange(null, ri, 'REMOVE')} />
                </td>
            </tr>)}
        </tbody>
        <Overlay show={visibleNewTablePopover} target={newTableTarget} placement='left' onHide={() => setVisibleNewTablePopover(false)} containerPadding={20} rootClose>
            <Popover style={{ maxWidth: 200 }}>
                <Popover.Title as='h3' className='p-3'>Create a Table</Popover.Title>
                <Popover.Content>
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="create-table-columns">Columns</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Small" aria-describedby="create-table-columns" value={tableMatrix.columns}
                            onChange={e => onChangeMatrixField(parseInt(e.target.value), 'columns')} />
                    </InputGroup>
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="create-table-rows">Rows</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Small" aria-describedby="create-table-rows" value={tableMatrix.rows}
                            onChange={e => onChangeMatrixField(parseInt(e.target.value), 'rows')} />
                    </InputGroup>
                    <div className='d-flex justify-content-end'>
                        <Button size='sm' onClick={onCreateTable}>Create & Close</Button>
                    </div>
                </Popover.Content>
            </Popover>
        </Overlay>
    </Table>);
};

AnswerTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        correct: PropTypes.bool,
        answer: PropTypes.string,
        image: PropTypes.string,
        tableHeaders: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ])
        ),
        tableData: PropTypes.arrayOf(PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ])
        ))
    })),
    onChange: PropTypes.func
}
AnswerTable.defaultProps = {
    headers: [],
    data: [],
    onChange: () => { }
};