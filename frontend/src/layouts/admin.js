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

// Pages
import AdminDashboard from '../pages/admin/dashboard';
import AdminSelectExamBody from '../pages/admin/questions/select-exam-body';
import AdminQuestionGroups from '../pages/admin/questions/question-groups';
import AdminQuestionsAdd from '../pages/admin/questions/question-add';
import AdminQuestionsEdit from '../pages/admin/questions/question-edit';
import AdminQuestionsList from '../pages/admin/questions/question-list';

// Components
import { CustomSwitch } from '../components/common/switch';

// Utils
import { connectAuth } from '../common/redux/connects';
import { isDarkTheme, toggleDarkTheme } from '../common/utils/theme';
import { UserRole } from '../common/enums/auth';

const VideoList = lazy(() => import('../pages/admin/videos/video-list'));
const VideoView = lazy(() => import('../pages/admin/videos/video-view'));
const VideoForm = lazy(() => import('../pages/admin/videos/video-form'));

const UserList = lazy(() => import('../pages/admin/users/users-list'));
const UserForm = lazy(() => import('../pages/admin/users/user-form'));
const UserView = lazy(() => import('../pages/admin/users/user-view'));

const ReportList = lazy(() => import('../pages/admin/reports/reports-list'));
const ReportView = lazy(() => import('../pages/admin/reports/reports-view'));



function AdminLayout({ match, history, user, logoutUserAction }) {
    const [darkTheme] = useState(isDarkTheme());

    return (<div className='vh-100 vw-100'>
        <Navbar className='shadow-sm bg-white' expand='sm'>
            <Navbar.Brand>
                <span className='cursor-pointer' onClick={() => history.push('/')}>Video Watching</span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className='justify-content-end'>
                <Nav className="mr-auto">
                    <Link className="nav-link" to="/admin/users">Users</Link>
                    <Link className="nav-link" to="/admin/videos">Videos</Link>
                    <Link className="nav-link" to="/admin/reports">Reports</Link>
                    {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                </Nav>
                <Nav className='ml-auto mr-3'>
                    <div className='d-flex'>
                        <CustomSwitch className='my-auto mr-1' value={darkTheme} onChange={e => toggleDarkTheme(e.target.checked)} />
                        <Nav.Link disabled className='px-0'>Dark Theme</Nav.Link>
                    </div>
                    <NavDropdown alignRight title={<FontAwesomeIcon className='mx-1 my-auto' icon={faUser} size='lg' />}>
                        {/* <NavDropdown.Item disabled={user.role !== UserRole.SuperAdmin}>Exam Bodies</NavDropdown.Item>
                        <NavDropdown.Item disabled={user.role !== UserRole.SuperAdmin}>Subjects</NavDropdown.Item>
                        <NavDropdown.Item disabled={user.role !== UserRole.SuperAdmin}>Topics & Sub Topics</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item disabled>Profile</NavDropdown.Item>
                        <NavDropdown.Item disabled>Notifications</NavDropdown.Item> */}
                        <NavDropdown.Item onClick={logoutUserAction}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <div className='mx-2'>
            <main className='container mt-3 shadow-sm rounded bg-white p-3 mt-2'>
                <Switch>
                    <Route exact path={`${match.url}/dashboard`} component={AdminDashboard} />
                    <Route exact path={`${match.url}/questions/select-exam-body`} component={AdminSelectExamBody} />
                    <Route exact path={`${match.url}/questions/by-exam-body/:examBodyId`} component={AdminQuestionGroups} />
                    <Route exact path={`${match.url}/questions/add/:examBodyId/:subjectId/:year`} component={AdminQuestionsAdd} />
                    <Route exact path={`${match.url}/questions/view/:examBodyId/:subjectId/:year`} component={AdminQuestionsList} />
                    <Route exact path={`${match.url}/questions/edit/:questionId`} component={AdminQuestionsEdit} />

                    <Route exact path={`${match.url}/videos`} component={VideoList} />
                    <Route exact path={`${match.url}/videos/view/:id`} component={VideoView} />
                    <Route exact path={`${match.url}/videos/add`} component={VideoForm} />
                    <Route exact path={`${match.url}/videos/:id/update`} component={VideoForm} />

                    <Route exact path={`${match.url}/users`} component={UserList} />
                    <Route exact path={`${match.url}/users/add`} component={UserForm} />
                    <Route exact path={`${match.url}/users/:id/update`} component={UserForm} />
                    <Route exact path={`${match.url}/users/view/:id`} component={UserView} />

                    <Route exact path={`${match.url}/reports`} component={ReportList} />
                    <Route exact path={`${match.url}/reports/view/:reportId`} component={ReportView} />

                    <Route path='/' >
                        <Redirect to={`${match.url}/dashboard`} />
                    </Route>

                </Switch>
            </main>
        </div>
    </div>);
};

export default withRouter(connectAuth(AdminLayout));