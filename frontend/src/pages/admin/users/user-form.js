import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';
import { UserGender } from '../../../common/enums/auth';
import UserApis from '../../../common/api/users';
import { capitalizeWord, validateEmail } from '../../../common/utils/common';
// import AuthAPI from '../../../common/api/auth';


function UserForm ({ history, addToastAction, match}) {
    const [id, setId] = useState(() => {
        return match.params.id
    });

    const [person, setPerson] = useState({
        gender: '', fullName: '',
        password: '', confirmPassword: '', email: ''
    });
    const [validationErrors, setValidationErrors] = useState({
        gender: '', fullName: '',
        password: '', confirmPassword: '', email: '', validated: false
    });
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        const arrGenders = [];
        for (const key in UserGender) {
            if (Object.hasOwnProperty.call(UserGender, key)) {
                const value = UserGender[key];
                arrGenders.push({
                    id: value,
                    name: capitalizeWord(value)
                });
            }
        }
        setGenders(arrGenders);
        setPerson({ ...person, gender: arrGenders[0].id })
    }, [UserGender])

    useEffect(() => {
        if(id) {
            UserApis
                .getOne({id: id})
                .then(res => {
                    setPerson(res.data);
                }, e =>  addToastAction("Loading Video faild", e.error, ToastStatus.Danger))
        }
    }, [id]);

    const onUpdatePerson = (value, key) => {
        setPerson({ ...person, [key]: value });
    }

    const onRegister = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const { newValidationErrors, invalid } = validateRegisterForm();
        setValidationErrors({
            ...newValidationErrors, validated: true
        });
        if (!invalid) {
            if(id) {
                UserApis
                    .updateOne({id: id, ...person})
                    .then(result => {
                        if(result.success) {
                            addToastAction(`Congrationations`, 'You have successfully updated.', ToastStatus.Success);
                        }
                    }, e => addToastAction(` ${e.error}`, e.message, ToastStatus.Danger))
                    
            } else {
                UserApis.createOne({
                    email: person.email,
                    fullName: person.fullName,
                    gender: person.gender,
                    password: person.password
                }).then(result => {
                    addToastAction(`Congrationations`, 'You have successfully registered a new account.', ToastStatus.Success);
                }, e => addToastAction(` ${e.error}`, e.message, ToastStatus.Danger));
            }
        }
    };

    const validateRegisterForm = () => {
        // Validate Registration Form
        const newValidationErrors = {
            email: '', fullName: '', gender: '',
            password: '', confirmPassword: ''
        };
        let valid = true;
        if (!person.email) {
            newValidationErrors.email = 'Please enter an email';
            valid = false;
        } else if (!validateEmail(person.email)){
            newValidationErrors.email = 'Please enter valid email';
            valid = false;
        }
        if (!person.fullName) {
            newValidationErrors.fullName = 'Please enter Full name';
            valid = false;
        }
        if (!person.gender) {
            newValidationErrors.gender = 'Please select your gender';
            valid = false;
        }
        if (!id) {
            if (!person.password) {
                newValidationErrors.password = 'Please enter password';
                valid = false;
            }
            if (!person.confirmPassword) {
                newValidationErrors.confirmPassword = 'Please enter password';
                valid = false;
            } else if (person.confirmPassword !== person.password) {
                newValidationErrors.confirmPassword = 'Different password detected';
                valid = false;
            }
        }
        return { newValidationErrors, invalid: !valid };
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Button variant='link' onClick={() => history.goBack()}>
                        <span className='h6'>Back</span>
                    </Button>
                </Col>
            </Row>

            <Row className='mb-5'>
                <Col>
                    <h1 className='text-primary text-center'>{`${id ? 'Update User info': 'Add a new user'}`}</h1>
                </Col>
            </Row>

            <Form validated={validationErrors.validated} onSubmit={onRegister}>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type='email' placeholder='Enter Email' value={person.email} isInvalid={!!validationErrors.email}
                        onChange={e => onUpdatePerson(e.target.value, 'email')} />
                    <Form.Control.Feedback type={!!validationErrors.email ? 'invalid' : 'valid'}>{validationErrors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Row>
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control required type='text' placeholder='Enter Full Name' value={person.fullName} isInvalid={!!validationErrors.fullName}
                                onChange={e => onUpdatePerson(e.target.value, 'fullName')} />
                            <Form.Control.Feedback type={!!validationErrors.fullName ? 'invalid' : 'valid'}>{validationErrors.fullName}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Form.Row>

                <Form.Row>
                    <Col xl={12} md={12} >
                        <Form.Group>
                            <Form.Label>Gender</Form.Label>
                            <Form.Control required as="select" value={person.gender} isInvalid={!!validationErrors.gender}
                                onChange={e => onUpdatePerson(e.target.value, 'gender')}>
                                {genders.map(gender => <option key={gender.id} value={gender.id}>{gender.name}</option>)}
                            </Form.Control>
                            <Form.Control.Feedback type={!!validationErrors.gender ? 'invalid' : 'valid'}>{validationErrors.gender}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Form.Row>
                {
                    !id && (
                    <React.Fragment>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type='password' placeholder='Password' value={person.password} isInvalid={!!validationErrors.password}
                                onChange={e => onUpdatePerson(e.target.value, 'password')} />
                            <Form.Control.Feedback type={!!validationErrors.password ? 'invalid' : 'valid'}>{validationErrors.password}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control required type='password' placeholder='Confirm Password' value={person.confirmPassword} isInvalid={!!validationErrors.confirmPassword}
                                onChange={e => onUpdatePerson(e.target.value, 'confirmPassword')} />
                            <Form.Control.Feedback type={!!validationErrors.confirmPassword ? 'invalid' : 'valid'}>{validationErrors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>
                    </React.Fragment>
                    )
                }
                <Form.Row className='justify-content-end'>
                    <Button className='ml-3' variant='primary' type="submit" onClick={onRegister}>
                        {`${id ?  "Update" : "Register"}`}
                    </Button>
                </Form.Row>
            </Form>
        </Container>
    )
}

UserForm.propTypes = {
    id: PropTypes.number
};

UserForm.defaultProps = {
    id: 0
};

export default withRouter(connectToasts(connectAuth(UserForm)));
