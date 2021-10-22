import React, { useState } from 'react';
import {
    Switch,
    Route,
    Redirect,
    withRouter
} from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';

import LandingPage from '../pages/landing';
import LoginPage from '../pages/auth/login';
import ForgotPasswordPage from '../pages/auth/forgot-password';
import ResetPasswordPage from '../pages/auth/reset-password';
import RegisterPage from '../pages/auth/register';
import { CustomSwitch } from '../components/common/switch';
import { connectAuth } from '../common/redux/connects';
import { isDarkTheme, toggleDarkTheme } from '../common/utils/theme';
import { getDefaultRedirectPath } from '../common/utils/auth';

function AnonymousLayout({ user, history, logoutUserAction }) {
    const [darkTheme] = useState(isDarkTheme());

    return (<div className='vh-100 vw-100'>
        <Navbar bg='dark' variant='dark' expand='md'>
            <Navbar.Brand>
                <span className='cursor-pointer' onClick={() => history.push('/')}>Video Watching</span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className='justify-content-end'>
                <Nav className='ml-auto mr-3'>
                    {!!user ? <Nav.Link className='ml-2' onClick={() => history.push(getDefaultRedirectPath())}>Go to Dashboard</Nav.Link> : null}
                    <div className='d-flex'>
                        <CustomSwitch className='my-auto mr-1' value={darkTheme} onChange={e => toggleDarkTheme(e.target.checked)} />
                        <Nav.Link disabled className='px-0'>Dark Theme</Nav.Link>
                    </div>
                    {!user ?
                        <Nav.Link className='ml-2' onClick={() => history.push('/auth/login')}>Log in</Nav.Link> :
                        <Nav.Link className='ml-2' onClick={logoutUserAction}>Log out</Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>

        <main className='container'>
            <Switch>
                <Route exact path='/' component={LandingPage} />
                <Route path='/auth' >
                    <Switch>
                        <Route exact path='/auth/login' component={LoginPage} />
                        <Route exact path='/auth/forgot-password' component={ForgotPasswordPage} />
                        <Route path='/auth/reset-password' component={ResetPasswordPage} />
                        <Route exact path='/auth/register' component={RegisterPage} />
                    </Switch>
                </Route>
                <Route path='/' >
                    <Redirect to='/' />
                </Route>
            </Switch>
        </main>
    </div>
    );
};

export default withRouter(connectAuth(AnonymousLayout));