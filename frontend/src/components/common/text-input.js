import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { MathComponent } from 'mathjax-react'

// const defaultTex = `\\begin{array}{l}\\frac{1}{x}\\end{array}`;

export const AnyTextInput = ({ value, onChange, className, editable, equation }) => {
    const onError = (error) => { console.log(error); };
    const onSuccess = () => { };

    const renderEditableArea = () => {
        if (editable) {
            return <Form.Control as='textarea' value={value} onChange={e => onChange(e.target.value)} />;
        } else if (!equation) {
            return <span>{value}</span>;
        }
    };

    return (<Fragment>
        {renderEditableArea()}
        {equation?<MathComponent tex={value} onError={(err) => onError(err)} onSuccess={() => onSuccess()} />:null}
    </Fragment>
    );
};
AnyTextInput.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    editable: PropTypes.bool,
    equation: PropTypes.bool
};
AnyTextInput.defaultProps = {
    className: '',
    value: '',
    onChange: () => {},
    editable: false,
    equation: false
};
