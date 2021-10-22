import React, { useState, lazy } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
    Switch,
    Route,
    Redirect,
    withRouter
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

//  pages
import CustomerDashboard from '../pages/customer/dashboard';
//  pages
import { CustomSwitch } from '../components/common/switch';
import { connectAuth } from '../common/redux/connects';
import { isDarkTheme, toggleDarkTheme } from '../common/utils/theme';

const VideoList = lazy(() => import('../pages/customer/videos/video-list'));
const VideoView = lazy(() => import('../pages/customer/videos/video-view'));

const UserView = lazy(() => import('../pages/admin/users/user-view'));
const ReportView = lazy(() => import('../pages/admin/reports/reports-view'));

function CustomerLayout({ match, history, logoutUserAction, user }) {
    const [darkTheme] = useState(isDarkTheme());

    return (<div className='vh-100 vw-100'>
        <Navbar bg='dark' variant='dark' expand='md'>
            <Navbar.Brand>
                <span className='cursor-pointer' onClick={() => history.push('/')}>Video Watching</span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className='justify-content-end'>
                <Nav className="mr-auto">
                    <Link className="nav-link" to={`${match.url}/videos`}>Videos</Link>
                    <Link className="nav-link" to={`${match.url}/users/${user.id}/reports`}>Report</Link>
                </Nav>

                <Nav className='ml-auto mr-3'>
                    <div className='d-flex'>
                        <CustomSwitch className='my-auto mr-1' value={darkTheme} onChange={e => toggleDarkTheme(e.target.checked)} />
                        <Nav.Link disabled className='px-0'>Dark Theme</Nav.Link>
                    </div>
                    <NavDropdown alignRight title={<FontAwesomeIcon className='mx-1 my-auto' icon={faUser} size='lg' />}>
                        {/* <NavDropdown.Item disabled>Profile</NavDropdown.Item>
                        <NavDropdown.Item disabled>Magazines</NavDropdown.Item>
                        <NavDropdown.Item disabled>Notifications</NavDropdown.Item> */}
                        {/* <NavDropdown.Divider /> */}
                        <NavDropdown.Item onClick={logoutUserAction}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

        <main className='container shadow-sm rounded bg-white p-3 mt-2'>
            <Switch>
                <Route exact path={`${match.url}/dashboard`} component={CustomerDashboard} />
                <Route exact path={`${match.url}/users`}>
                    <div>User Management</div>
                </Route>
                <Route exact path={`${match.url}/users/:id/reports`} component={UserView} />
                <Route exact path={`${match.url}/users/:id/reports/:reportId`} component={ReportView} />

                <Route exact path={`${match.url}/videos`} component={VideoList} />
                <Route exact path={`${match.url}/videos/view/:id`} component={VideoView} />

                <Route path='/' >
                    <Redirect to={`${match.url}/videos`} />
                </Route>
            </Switch>
        </main>
    </div>);
};

export default withRouter(connectAuth(CustomerLayout));
