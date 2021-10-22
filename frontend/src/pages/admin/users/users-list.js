import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Pagination, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';
import { ConfirmPopover } from '../../../components/common/popover';

import UserApis from '../../../common/api/users';
import { timeFromNow } from '../../../common/utils/common';

function AdminUsersList({ history, addToastAction }) {
    let [users, setUsers] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [selectedId, setSelectedId] = useState(1);

    const [removeConfirmTarget, setRemoveConfirmTarget] = useState(null);
    const [removeConfirmVisibility, setRemoveConfirmVisibility] = useState(false);

    const [total, setTotal] = useState({ pagesCount: 1, groupsCount: 10 });

    const refreshPage = () => {
        UserApis
            .getAll({ page: pageIndex, perPage: total.groupsCount })
            .then((data) => {
                setTotal({
                    ...total,
                    pagesCount: data.totalPages,
                });
                setUsers(data.users)
            })
    }

    const removeVideo = () => {
        UserApis
            .removeOne({id: selectedId})
            .then(res => {
                console.log("res", res);
                if(res.success) {   
                    addToastAction("Video Status", 'Remove success', ToastStatus.Success);
                    refreshPage();
                }
            })
            .catch(e => {
                addToastAction("Video Status", e.error, ToastStatus.Danger)
            })
    }

    useEffect(() => {
        refreshPage();
    }, [pageIndex, total.groupsCount])

    return (
        <Container className='pt-4'>
        <Row>
            <Col>
                <Button variant='link' onClick={() => history.goBack()}>
                    <span className='h6'>Back</span>
                </Button>
            </Col>
        </Row>
        
        <Row className='mb-5'>
            <Col>
                <h1 className='text-center text-primary'>Users</h1>
            </Col>
        </Row>
       
        <div>
            <div>
                <div className="float-left mb-2">
                    <Link to="/admin/users/add">
                    <Button variant="success">
                            Add
                            <FontAwesomeIcon 
                                className='cursor-pointer text-info ml-2' 
                                size='sm' 
                                icon={faPlus}
                            />
                        </Button>{' '}
                    </Link>
                </div>
                <div className="float-right mb-2">
                    <DropdownButton
                        as={ButtonGroup}
                        key={'Info'}
                        id={`dropdown-variants-${'Info'}`}
                        variant={'Info'.toLowerCase()}
                        title={'Page'}
                        onChange={(e) => {
                            console.log("ad", e);
                        }}
                    >
                        {
                            [10, 20, 50, 100].map((number) => (
                                <Dropdown.Item key={number} eventKey={number} onSelect={(e) => { setTotal({...total, groupsCount: e}) }}>{number}</Dropdown.Item>
                            ))
                        }
                    </DropdownButton>
                </div>
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.gender}</td>
                                <td>{user.role}</td>
                                <td>{timeFromNow(user.createdAt)}</td>
                                <td>{timeFromNow(user.updatedAt)}</td>

                                <td className="text-center">
                                    {/* <Link to={`/admin/users/view/${user.id}`} title="View">
                                        <FontAwesomeIcon 
                                            className='cursor-pointer text-info ml-2' 
                                            size='lg' 
                                            icon={faEye}
                                        />
                                    </Link> */}
                                    <Link to={`/admin/users/${user.id}/update`} title="Edit">
                                        <FontAwesomeIcon className='cursor-pointer text-info ml-2' size='lg' icon={faEdit} 
                                            title="Edit"
                                        />
                                    </Link>
                                    <FontAwesomeIcon className='cursor-pointer text-danger ml-2' size='lg' icon={faTrash}
                                        onClick={(e) => {
                                            setRemoveConfirmVisibility(true)
                                            setSelectedId(user.id)
                                            setRemoveConfirmTarget(e.target)
                                        }}
                                        title="Remove"
                                    />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Row className='justify-content-end'>
                <Col>
                    <Pagination className='float-right'>
                        <Pagination.First disabled={pageIndex <= 1} onClick={() => setPageIndex(1)} />
                        <Pagination.Prev disabled={pageIndex <= 1} onClick={() => setPageIndex(pageIndex - 1)} />
                        <Pagination.Item active>{pageIndex}</Pagination.Item>
                        <Pagination.Next disabled={pageIndex >= total.pagesCount} onClick={() => setPageIndex(pageIndex + 1)} />
                        <Pagination.Last disabled={pageIndex >= total.pagesCount} onClick={() => setPageIndex(total.pagesCount)} />
                    </Pagination>
                </Col>
            </Row>
        </div>
        <ConfirmPopover 
            visible={removeConfirmVisibility} 
            target={removeConfirmTarget}
            setVisibility={setRemoveConfirmVisibility}
            label="Are you sure to delete this User?"
            onConfirm={removeVideo}
        />
    </Container>
    );
};

AdminUsersList.propTypes = {};
AdminUsersList.defaultProps = {};

export default withRouter(connectToasts(connectAuth(AdminUsersList)));
