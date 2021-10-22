import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Form
} from 'react-bootstrap';
import { withRouter } from 'react-router';

import { getDefaultRedirectPath } from '../../common/utils/auth';
import { connectAuth } from '../../common/redux/connects';

function PaymentPage({ user, loginUserAction, history, authError }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        user && history.replace(getDefaultRedirectPath());
    }, [user])

    return (
        <div className='py-100'>
            <Card className='mx-auto shadow-sm' style={{ width: 'fit-content' }}>
                <Card.Header as='h5'>Input your paypal info</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group controlId='loginFormEmail'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type='email' placeholder='Enter email' value={email} onChange={e => setEmail(e.target.value)} />
                            <Form.Text className='text-muted'>  
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId='loginFormPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}
                                onKeyPress={event => (event.key === 'Enter') && loginUserAction({ email, password }, history)} />
                            {/*
                                <Form.Text className='text-muted'>
                                    <span className='cursor-pointer hover-underline' onClick={() => history.push('/auth/forgot-password')}>Fotgot password?</span>
                                </Form.Text>
                            */}
                        </Form.Group>
                        <Form.Group>
                            <Form.Text className='text-center text-danger'>
                                {isSubmit && String(authError)}
                            </Form.Text>
                        </Form.Group>

                        <Form.Row className='justify-content-end'>
                            <Button className='float-right' variant='primary' onClick={() => {
                                setIsSubmit(true)
                                loginUserAction({ email, password }, history)
                            }}>
                                Login
                            </Button>
                        </Form.Row>

                        <Form.Row className='flex-direction-column'>
                            <hr className='w-100'></hr>
                            <Form.Text className='text-muted mx-auto'>
                                <span className='cursor-pointer hover-underline' onClick={() => history.push('/register')}>Register now</span>
                            </Form.Text>
                        </Form.Row>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default withRouter(connectAuth(PaymentPage));

