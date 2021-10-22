import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
// import Table from 'react-bootstrap/Table';
import { Button, Container, Row, Col } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/';

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';
// import { ConfirmPopover } from '../../../components/common/popover';

import VideoApis from '../../../common/api/videos';
import { AssetsServerURL } from '../../../common/constants/default-values';


function VideoView ({match, history, addToastAction, user}) {
    const videoId = match.params.id
    const [video, setVideo] = useState(null)
    // const [playingVideo, setPlayingVideo] = useState(false)

    const refreshPage = () => {
        VideoApis
            .getVideo({id: videoId})
            .then(res => {
                setVideo(res.data)
            }, e =>  addToastAction("Loading Video", e.error, ToastStatus.Danger) )
    }

    useEffect(() => {
        refreshPage();
    }, [ videoId ])

    if(!video) {
        return null
    }

    const videoUrl = `${AssetsServerURL}/${video.src}`;

    return (
        <Container>
            <Row>
                <Col>
                    <Button variant='link' onClick={() => history.goBack()}>
                        <span className='h6'>Back</span>
                    </Button>
                </Col>
            </Row>
            <div className='text-center'>
                <p>{video.title}</p>
            </div>
            <div style={{
                    position: 'relative',
                    paddingTop: '56.25%' 
                }}
                className="player-wrapper"
            >
              
                <ReactPlayer
                    className='react-player'
                    url={videoUrl}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    controls
                    playing
                    width='100%'
                    height='100%'
                />
            </div>
        </Container>
    )
}

VideoView.propTypes = {
    id: PropTypes.number
};

VideoView.defaultProps = {
    id: 0
};

export default withRouter(connectToasts(connectAuth(VideoView)));
