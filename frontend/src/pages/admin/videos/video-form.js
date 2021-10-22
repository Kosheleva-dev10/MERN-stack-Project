import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/';

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';

import VideoApis from '../../../common/api/videos';
import { AssetsServerURL } from '../../../common/constants/default-values';


function VideoAdd ({ history, addToastAction, match}) {
    const [id, setId] = useState(() => {
        return match.params.id
    });
    const [title, setTitle] = useState("")
    const [file, setFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [oldVideo, setOldVideo] = useState({})
    const fileRef = useRef(null);
    
    const initValues = () => {
        setTitle("")
        setFile(null);
        setIsUploading(false);
        fileRef.current.value = ""
    }

    const submitVideo = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setIsUploading(true);

        if(id) {
            VideoApis
                .updateVideo({id: id, title: title, file: file})
                .then(() => {
                    addToastAction("Alert", "Success", ToastStatus.Success);
                    history.goBack();
                })
            
        } else {
            VideoApis
                .addVideo({title: title, file: file })
                .then(() => {
                    addToastAction("Alert", "Success", ToastStatus.Success);
                    initValues();
                })
                .catch(err =>{
                    addToastAction("Alert", err.error, ToastStatus.Danger);
                    setIsUploading(false);
                })
        }
    }

    const removeVideo = () => {
        VideoApis
            .removeVideo({id: id})
            .then(() => {
                addToastAction("Alert", "Video has been deleted", ToastStatus.Success);
                setId(id);
                refreshPage();
            })
            .catch(err => {
                addToastAction(`[${err}] ${err.error}`, `${err.error}`, ToastStatus.Danger);
            })
    }

    const refreshPage = () => {
        VideoApis
            .getVideo({id: id})
            .then(res => {
                setOldVideo(res.data);
                setTitle(res.data.title)
            }, e =>  addToastAction("Loading Video faild", e.error, ToastStatus.Danger) )
    }

    useEffect(() => {
        if(id) {
            refreshPage();
        }
    }, [id]);

    console.log("oldVideo", oldVideo);

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
                    <h1 className='text-primary text-center'>{`${id ? 'Update Video': 'Add a new Video'}`}</h1>
                </Col>
            </Row>

            <Form onSubmit={(e) => submitVideo(e)}
            >
                <Row>
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label><strong>Video Title</strong></Form.Label>
                            <Form.Control name="title" type="text" placeholder="Video title" required onChange={e => setTitle(e.target.value)} value={title} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    {
                        !oldVideo.src  && 
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label><strong>Add a new Video file</strong></Form.Label>
                                <Form.File ref={fileRef} id="file" name="file" multiple={false} onChange={e => setFile(e.target.files[0])}/>
                            </Form.Group>
                        </Col>
                    }
                    {
                        id && oldVideo.src  && (
                        <React.Fragment>
                            <Col md={4}>
                            {
                                oldVideo.src && <div style={{
                                            position: 'relative',
                                            paddingTop: '56.25%' 
                                        }}
                                        className="player-wrapper"
                                    >
                                        <ReactPlayer
                                            className='react-player'
                                            url={`${AssetsServerURL}/${oldVideo.src}`}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0
                                            }}
                                            controls
                                            width='100%'
                                            height='100%'
                                        />
                                    </div>
                            }
                            </Col>
                            <Col md={4}>
                                <Button className="right" variant="danger" onClick={() => removeVideo()}>
                                    Remove
                                </Button>
                            </Col>
                        </React.Fragment>
                        )
                    }
                </Row>
                <Row>
                    <Col className="text-right">
                        <Button className="right" variant="primary" type="submit" disabled={isUploading}>
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>

        </Container>
    )
}

VideoAdd.propTypes = {
    id: PropTypes.number
};

VideoAdd.defaultProps = {
    id: 0
};

export default withRouter(connectToasts(connectAuth(VideoAdd)));
