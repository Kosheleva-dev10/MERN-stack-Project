import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form
} from 'react-bootstrap';
import { withRouter } from 'react-router';

import { UserGender } from '../../common/enums/auth';
import { capitalizeWord, validateEmail } from '../../common/utils/common';
// import { BootstrapDatePicker } from '../../components/common/datepicker';

import AuthAPI from '../../common/api/auth';
import { connectToasts } from '../../common/redux/connects';
import { ToastStatus } from '../../common/enums/toast';

function RegisterPage({ history, addToastAction }) {
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
    }, []);

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
            AuthAPI.registerUser({
                email: person.email,
                fullName: person.fullName,
                gender: person.gender,
                password: person.password
            }).then(result => {
                addToastAction(`Congrationations`, 'You have successfully registered a new account.', ToastStatus.Success);
                history.push('/auth/login');
            }, e => addToastAction(`[${e.statusCode}] ${e.error}`, e.message, ToastStatus.Danger));
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
        return { newValidationErrors, invalid: !valid };
    };

    return (
        <div className='py-100'>
            <Card className='mx-auto shadow-sm' style={{width: 'fit-content', minWidth: '400px'}}>
                <Card.Header as='h5'>Register</Card.Header>
                <Card.Body>
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

                        <Form.Row className='justify-content-end'>
                            <Button className='ml-3' variant='primary' onClick={onRegister}>
                                Register
                            </Button>
                        </Form.Row>

                        <Form.Row className='flex-direction-column'>
                            <hr className='w-100'></hr>
                            <Form.Text className='text-muted mx-auto'>
                                <span className='cursor-pointer hover-underline' onClick={() => history.push('/login')}>Already registered?</span>
                            </Form.Text>
                        </Form.Row>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default withRouter(connectToasts(RegisterPage));
