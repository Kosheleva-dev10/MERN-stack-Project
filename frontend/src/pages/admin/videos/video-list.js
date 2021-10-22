import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Pagination, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';
import { ConfirmPopover } from '../../../components/common/popover';

import VideoApis from '../../../common/api/videos';
import { timeFromNow } from '../../../common/utils/common';

function VideoList ({addToastAction, history}) {
    let [videos, setVideos] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [selectedVideoId, setSelectedVideoId] = useState(0);

    const [removeConfirmTarget, setRemoveConfirmTarget] = useState(null);
    const [removeConfirmVisibility, setRemoveConfirmVisibility] = useState(false);

    const [total, setTotal] = useState({ pagesCount: 1, groupsCount: 10 });

    const refreshPage = () => {
        VideoApis
            .getVideos({ page: pageIndex, perPage: total.groupsCount })
            .then((data) => {
                setTotal({
                    ...total,
                    pagesCount: data.totalPages,
                });
                setVideos(data.videos)
            })
    }

    const removeVideo = () => {
        VideoApis
            .remove({id: selectedVideoId})
            .then(res => {
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
                    <h1 className='text-center text-primary'>Video List</h1>
                </Col>
            </Row>

            <div>
                <div>
                    <div className="float-left mb-2">
                        <Link to="/admin/videos/add">
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
                            <th>Title</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            videos.map((video, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{video.title}</td>
                                    <td>{timeFromNow(video.createdAt)}</td>
                                    <td>{timeFromNow(video.updatedAt)}</td>

                                    <td className="text-center">
                                        <Link to={`/admin/videos/view/${video.id}`} title="View">
                                            <FontAwesomeIcon 
                                                className='cursor-pointer text-info ml-2' 
                                                size='lg' 
                                                icon={faEye}
                                            />
                                        </Link>
                                        <Link to={`/admin/videos/${video.id}/update`} title="Edit">
                                            <FontAwesomeIcon className='cursor-pointer text-info ml-2' size='lg' icon={faEdit} 
                                                title="Edit"
                                            />
                                        </Link>
                                        <FontAwesomeIcon className='cursor-pointer text-danger ml-2' size='lg' icon={faTrash}
                                            onClick={(e) => {
                                                setRemoveConfirmVisibility(true)
                                                setSelectedVideoId(video.id)
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
                label="Are you sure to delete this video?"
                onConfirm={removeVideo}
            />
        </Container>
    )
}

VideoList.propTypes = {};

VideoList.defaultProps = {};

export default withRouter(connectToasts(connectAuth(VideoList)));
