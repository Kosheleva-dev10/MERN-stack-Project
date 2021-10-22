import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Container, Row, Col, Pagination, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import { decodeToken } from "react-jwt";

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { timeFromNow } from '../../../common/utils/common';

import UserAPI from '../../../common/api/users';

function UserDashboard({ history, addToastAction, user }) {
    let [users, setUsers] = useState([]);

    useEffect(() => {
        UserAPI
            .allUsers()
            .then((data) => {
                let userData = decodeToken(localStorage.getItem('access-token'));
                let displayData = [];
                for (let i = 0; i < data.users.length; i++) {
                    if (data.users[i].email == userData.sub) {
                        if (i == 0) {
                            if (data.users.length <= 10) {
                                for (let k = 1; k <= data.users.length; k++) {
                                    displayData.push(data.users[k]);
                                }
                            } else {
                                for (let k = 1; k <= 10; k++) {
                                    displayData.push(data.users[k]);
                                }
                            }
                        } else {
                            if ((i * 10 + 1) < data.users.length && (i * 10 + 10) <= data.users.length) {
                                for (let k = (i * 10 + 1); k <= (i * 10 + 10); k++) {
                                    displayData.push(data.users[k]);
                                }
                            }
                            else if ((i * 10 + 1) <= data.users.length && (i * 10 + 10) > data.users.length) {
                                for (let k = (i * 10 + 1); k < data.users.length; k++) {
                                    displayData.push(data.users[k]);
                                }
                            }
                        }
                    }
                }
                setUsers(displayData)
                // data.users.map((user, index) => {
                // })
            });
    }, [])


    return (
        <Container className='pt-4'>
            <Row className='mb-5'>
                <Col>
                    <h1 className='text-center text-primary'>User List</h1>
                </Col>
            </Row>

            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Updated At</th>
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
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </Container>
    )
}

UserDashboard.propTypes = {};

UserDashboard.defaultProps = {};

export default withRouter(connectToasts(connectAuth(UserDashboard)));

