import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faExclamationCircle, faCheck, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { timeFromNow, dateToLocalString } from '../../../common/utils/common';
import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';
import { ConfirmPopover } from '../../../components/common/popover';

import WatchhistoryApis from '../../../common/api/watch-history';
import PopuphistoryApis from '../../../common/api/popup-history';
import { UserRole } from '../../../common/enums/auth';

function ReportView ({match, history, addToastAction, user}) {
    const id = match.params.reportId
    const [selectedId, setSelectedId] = useState(0);
    const [currentData, setCurrentData] = useState(null)


    const [removePopupConfirmTarget, setRemovePopupConfirmTarget] = useState(null);
    const [removePopupConfirmVisibility, setRemovePopupConfirmVisibility] = useState(false);

    const [removeConfirmTarget, setRemoveConfirmTarget] = useState(null);
    const [removeConfirmVisibility, setRemoveConfirmVisibility] = useState(false);

    const refreshPage = () => {
        WatchhistoryApis
            .getOne({id: id})
            .then(res => {
                setCurrentData(res.data)
            }, e =>  addToastAction("Error", e.error, ToastStatus.Danger) )
    }

    const removeHistory = () => {
        WatchhistoryApis
            .remove({id: id})
            .then(() => {
                addToastAction("Alert", 'Remove success', ToastStatus.Success);
                history.goBack();
            })
            .catch(e => {
                addToastAction("Alert", e.error, ToastStatus.Danger)
            })
    }

    const removePopupHistory = () => {
        PopuphistoryApis
            .remove({id: selectedId})
            .then(() => {
                addToastAction("Alert", 'Remove success', ToastStatus.Success);
                setSelectedId(0)
            })
            .catch(e => {
                addToastAction("Alert", e.error, ToastStatus.Danger)
            })
    }

    useEffect(() => {
        refreshPage();
    }, [ id, selectedId ])

    if(!currentData) {
        return null
    }

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
                    <h1 className='text-center text-primary'>Report</h1>
                </Col>
            </Row>
            <Row className=''>
                <Col>
                    <p>
                        User name: &nbsp;
                        <Link to={`/admin/users/view/${currentData.user.id}`} title={currentData.user.fullName}>
                            {`${currentData.user.fullName}`.substr(0, 20) }
                        </Link>
                    </p>
                    <p>Played at: {timeFromNow(currentData.createdAt)}</p>
                    <div>
                        <p className="float-left">
                            Finished: 
                            <FontAwesomeIcon 
                                className="cursor-pointer ml-2" 
                                size='lg'
                                aria-disabled
                                color={currentData.isFinished ? "green" : "red"}
                                icon={currentData.isFinished ? faCheck : faExclamationCircle }
                                title={currentData.isFinished ? "Finished" : "Didnt Finished"}
                            />
                        </p>
                        {
                            user.role === UserRole.Admin &&
                            <p className="float-right mr-2">
                                <Button 
                                    variant="outline-danger" size="sm" 
                                    onClick={(e) => [setRemoveConfirmTarget(e.target), setRemoveConfirmVisibility(true)]}
                                >Remove</Button>{' '}
                            </p>
                        }
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Started At</th>
                                <th>Clicked At</th>
                                <th className="text-center">Clicked</th>
                                {
                                    user.role === UserRole.Admin &&
                                    <th className="text-center">Actions</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentData.popupHistories.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {/* <td>
                                            <Link to={`/admin/users/view/${item.user.id}`} title={item.user.fullName}>
                                                { item.user.fullName }
                                            </Link>
                                        </td> */}
                                        <td>{dateToLocalString(item.createdAt)}</td>
                                        <td>{item.isClicked && dateToLocalString(item.updatedAt)}</td>
                                        {/* <td className="text-center">
                                            <Link to={`/admin/videos/view/${item.video.id}`} title={item.video.title}>
                                                { `${item.video.title}`.substr(0, 10) }
                                            </Link>
                                        </td> */}
                                        <td className="text-center">
                                            <FontAwesomeIcon 
                                                className="cursor-pointer ml-2" 
                                                size='lg'
                                                aria-disabled
                                                color={item.isClicked ? 'green': 'red'}
                                                icon={item.isClicked ? faUserCheck : faExclamationCircle }
                                                title={item.isClicked ? "Clicked" : "Didnt Clicked"}
                                            />
                                        </td>
                                        {
                                            user.role === UserRole.Admin &&
                                            <td className="text-center">
                                                <FontAwesomeIcon className='cursor-pointer text-danger ml-2' size='lg' icon={faTrash}
                                                    onClick={(e) => ([
                                                        setSelectedId(item.id),
                                                        setRemovePopupConfirmVisibility(true),
                                                        setRemovePopupConfirmTarget(e.target)
                                                    ])}
                                                    title="Remove"
                                                />
                                            </td>
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <ConfirmPopover 
                visible={removeConfirmVisibility} 
                target={removeConfirmTarget}
                setVisibility={() => setRemoveConfirmVisibility(false)}
                label="Are you sure to delete this report?"
                onConfirm={removeHistory}
            />
            <ConfirmPopover 
                visible={removePopupConfirmVisibility} 
                target={removePopupConfirmTarget}
                setVisibility={() => setRemovePopupConfirmVisibility(false)}
                label="Are you sure to delete this popup result?"
                onConfirm={removePopupHistory}
            />
        </Container>
    )
}

ReportView.propTypes = {
    id: PropTypes.number
};

ReportView.defaultProps = {
    id: 0
};

export default withRouter(connectToasts(connectAuth(ReportView)));
