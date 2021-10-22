import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

export const CustomSelect = ({ label, value, values, onChange }) => {
    return (
        <Form.Group>
            <Form.Label><strong>{label}</strong></Form.Label>
            <Form.Control as="select" onChange={onChange} value={value}>
                {values.map(eachValue => 
                    typeof eachValue === 'object' ?
                    <option key={eachValue.id} value={eachValue.id}>{eachValue.name}</option> :
                    <option key={eachValue}>{eachValue}</option>
                )}
            </Form.Control>
        </Form.Group>
    );
};

CustomSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    values: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string
        })
    ])),
    onChange: PropTypes.func
};
CustomSelect.defaultProps = {
    label: '',
    values: [],
    onChange: () => { }
};
