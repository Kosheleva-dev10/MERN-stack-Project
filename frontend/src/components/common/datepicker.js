import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const BootstrapDatePicker = ({ date, onChange, showMonthDropdown, showYearDropdown }) => {
    const BootstrapTextInput = forwardRef(
        ({ value, onClick }, ref) => (
            <Form.Control value={value} type='text' ref={ref} onFocus={onClick} onChange={() => {}} placeholder='Choose date' />
        ),
    );

    return <DatePicker wrapperClassName='d-block' selected={date} showMonthDropdown={showMonthDropdown} showYearDropdown={showYearDropdown}
        onChange={d => onChange(d)} customInput={<BootstrapTextInput />}/>;
};
BootstrapDatePicker.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    showMonthDropdown: PropTypes.bool,
    showYearDropdown: PropTypes.bool
};
BootstrapDatePicker.defaultProps = {
    value: new Date(),
    onChange: () => {},
    showMonthDropdown: false,
    showYearDropdown: false
};
