import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Container, Row, Col, Pagination, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import { connectToasts, connectAuth } from '../../common/redux/connects';
import { timeFromNow } from '../../common/utils/common';

import UserAPI from '../../common/api/users';

function AdminDashboard({ history, addToastAction, user }) {
    let [users, setUsers] = useState([]);
    let [pagination, setPagination] = useState([10, 20, 50, 100]);
    const [pageIndex, setPageIndex] = useState(1);
    const [countUsers, setCountUsers] = useState([]);

    const [total, setTotal] = useState({ pagesCount: 1, groupsCount: 10 });

    useEffect(() => {
        UserAPI
            .getAll({ page: pageIndex, perPage: total.groupsCount })
            .then((data) => {
                setTotal({
                    ...total,
                    pagesCount: data.totalPages,
                });
                setUsers(data.users);
            });
        UserAPI
            .allUsers()
            .then((data) => {
                let number = [];
                for (let i = 0; i < data.users.length; i++) {
                    number.push(i * 10 + 1);
                }
                console.log(number);
                setCountUsers(number);
            });
    }, [pageIndex, total.groupsCount])


    return (
        <Container className='pt-4'>
            <Row className='mb-5'>
                <Col>
                    <h1 className='text-center text-primary'>User List</h1>
                </Col>
            </Row>

            <div>
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
                            pagination.map((number) => (
                                <Dropdown.Item key={number} eventKey={number} onSelect={(e) => { setTotal({ ...total, groupsCount: e }) }}>{number}</Dropdown.Item>
                            ))
                        }
                    </DropdownButton>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.fullName}</td>
                                    <td>{timeFromNow(user.createdAt)}</td>
                                    <td>{timeFromNow(user.updatedAt)}</td>
                                    {
                                        ((((pageIndex - 1) * total.groupsCount + index) * 10 + 1) < countUsers.length && (index + 1) * 10 < countUsers.length)
                                            ?
                                            <td>{10}</td>
                                            :
                                            (
                                                ((((pageIndex - 1) * total.groupsCount + index) * 10 + 1) < countUsers.length && (index + 1) * 10 > countUsers.length)
                                                    ?
                                                    <td>{(countUsers.length - (((pageIndex - 1) * total.groupsCount + index) * 10 + 1))}</td>
                                                    :
                                                    <td>{0}</td>
                                            )
                                    }
                                </tr>
                            })
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
        </Container>
    )
}

AdminDashboard.propTypes = {};

AdminDashboard.defaultProps = {};

export default withRouter(connectToasts(connectAuth(AdminDashboard)));

