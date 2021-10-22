import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Pagination, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';
import { ConfirmPopover } from '../../../components/common/popover';

import WatchhistoryApis from '../../../common/api/watch-history';
import { dateToLocalString, getClickedPopupCount, getlostPopupCount } from '../../../common/utils/common';

function ReportList ({addToastAction, history}) {
    let [watchList, setWatchList] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [selectedId, setSelectedId] = useState(0);

    const [removeConfirmTarget, setRemoveConfirmTarget] = useState(null);
    const [removeConfirmVisibility, setRemoveConfirmVisibility] = useState(false);

    const [total, setTotal] = useState({ pagesCount: 1, groupsCount: 10 });

    const refreshPage = () => {
        WatchhistoryApis
            .getAll({ page: pageIndex, perPage: total.groupsCount })
            .then((res) => {
                setTotal({
                    ...total,
                    pagesCount: res.totalPages,
                });
                setWatchList(res.data)
            })
    }

    const removeHistory = () => {
        WatchhistoryApis
            .remove({id: selectedId})
            .then(res => {
                if(res.success) {
                    addToastAction("Alert", 'Remove success', ToastStatus.Success);
                    refreshPage();
                }
            })
            .catch(e => {
                addToastAction("Alert", e.error, ToastStatus.Danger)
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
                    <h1 className='text-center text-primary'>Report List</h1>
                </Col>
            </Row>

            <div>
                <div className="text-right">
                    <div className="mb-2">
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
                            <th>User name</th>
                            <th className="text-center">Video</th>
                            <th>Started At</th>
                            {/* <th>Updated At</th> */}
                            <th className="text-center">Popup Clicked</th>
                            <th className="text-center">Popup Lost</th>
                            <th className="text-center">Completed</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            watchList.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link to={`/admin/users/view/${item.user.id}`} title={item.user.fullName}>
                                            { item.user.fullName }
                                        </Link>
                                    </td>
                                    <td className="text-center">
                                        <Link to={`/admin/videos/view/${item.video.id}`} title={item.video.title}>
                                            { `${item.video.title}`.substr(0, 10) }
                                        </Link>
                                    </td>
                                    <td>{dateToLocalString(item.createdAt)}</td>
                                    <td className="text-center">{getClickedPopupCount(item.popupHistories)}</td>
                                    <td className="text-center">{getlostPopupCount(item.popupHistories)}</td>
                                    <td className="text-center">
                                        <FontAwesomeIcon
                                            className='cursor-pointer text-info mr-2' 
                                            size='lg'
                                            aria-disabled
                                            icon={getlostPopupCount(item.popupHistories) === 0 && item.isFinished ? faCheck : faTimes}
                                            title={item.isFinished ? "Clicked" : "Didnt Click"}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <Link to={`/admin/reports/view/${item.id}`} title="View">
                                            <FontAwesomeIcon
                                                className='cursor-pointer text-info mr-2' 
                                                size='lg' 
                                                icon={faEye}
                                            />
                                        </Link>
                                        <FontAwesomeIcon className='cursor-pointer text-danger ml-2' size='lg' icon={faTrash}
                                            onClick={(e) => {
                                                setRemoveConfirmVisibility(true)
                                                setSelectedId(item.id)
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
                setVisibility={() => setRemoveConfirmVisibility(false)}
                label="Are you sure to delete this report?"
                onConfirm={removeHistory}
            />
        </Container>
    )
}

ReportList.propTypes = {};

ReportList.defaultProps = {};

export default withRouter(connectToasts(connectAuth(ReportList)));
