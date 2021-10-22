import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';
import { Button, Container, Row, Col, Toast, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import { connectToasts, connectAuth } from '../../../common/redux/connects';
import { ToastStatus } from '../../../common/enums/toast';
import { secsToHMS } from '../../../common/utils/common';

import VideoApis from '../../../common/api/videos';
import { AssetsServerURL } from '../../../common/constants/default-values';
import socket from '../../../common/socket';
import { POPUP_DESTROY, VIDEO_START_PLAYING, VIDEO_END_VIDEO, POPUP_PUSH } from '../../../common/socket/types';

function VideoView ({match, history, addToastAction}) {
    const videoId = match.params.id
    const [video, setVideo] = useState(null)
    const [watchId, setWatchId] = useState(0)
    const [popupHistoryId, setPopupHistoryId] = useState(0)
    const [playerProgree, setPlayerProgree] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [videoDuration, setVideoDuration] = useState(0)
    const [isShowConfirmMessage, setIsShowConfirmMessage] = useState(false)
    const [playingVideo, setPlayingVideo] = useState(false)
    const videoPlayerRef = useRef(null)

    useEffect(() => {
        VideoApis
            .getVideo({id: videoId})
            .then(res => {
                if(res.success) {
                    setVideo(res.data)
                }
            })
            .catch(e =>  addToastAction("Loading Video", e.error, ToastStatus.Danger))
    }, [videoId])

    const onPauseVideo = () => {
        setPlayingVideo(true)
    }

    const onStartVideo = () => {
        console.log("playing video....");
        setWatchId(0)
        setPopupHistoryId(0)
        socket.open();

        socket.emit(VIDEO_START_PLAYING, videoId)

        socket.on(POPUP_PUSH, (newWatchId , newPopupHistoryId) => {
            if(popupHistoryId !== newPopupHistoryId && playingVideo) {
                setWatchId(newWatchId);
                setPopupHistoryId(newPopupHistoryId);
                setIsShowConfirmMessage(true);
                console.log("popupHistoryIdx: ", newWatchId); // world
            } else {
                console.log("message not pushed");
            }
        });
    }

    const onEndedVideo = () => {
        console.log("onEndedVideo");

        setPlayingVideo(false)
        socket.emit(VIDEO_END_VIDEO, watchId);
        setWatchId(0);
        setPopupHistoryId(0);
        socket.close();
    }

    const reportPopupResult = (clicked = false) => {
        console.log("reportPopupResult: ", clicked);

        if(watchId && popupHistoryId && playingVideo) {
            socket.emit(POPUP_DESTROY, watchId, popupHistoryId, clicked)
            setPopupHistoryId(0);
        } else {
            console.log("watchId or popupHistoryId is null")
        }
    }

    useEffect(() => {
        return () => {
            socket.close();
            setIsShowConfirmMessage(false)
        }
    }, [ videoId ])

    useEffect(() => {
        let _timer = setInterval(() => {
            if(videoPlayerRef.current) {
                const duration = videoPlayerRef.current.getDuration();
                const currentSeconds = videoPlayerRef.current.getCurrentTime();
                let percent = (currentSeconds / duration) * 100;

                setCurrentTime(secsToHMS(currentSeconds))
                setVideoDuration(secsToHMS(duration))
                setPlayerProgree(percent)
            }
        }, 100);

        return () => {
            if(_timer) {
                clearInterval(_timer)
            }
        }
    }, [videoPlayerRef])

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
            <div 
            style={{ 
                    width: 300, 
                    position: 'absolute', 
                    right: 0,
                    top: 0, 
                    zIndex: 9999 
                }}
                className='d-flex flex-column align-items-end'
            >
                <Toast 
                    show={isShowConfirmMessage}
                    key={1}
                    className='w-100' 
                    style={{ flexBasis: 'unset' }} 
                    animation
                    autohide
                    // delay={5000}
                    onClose={() => {
                        console.log("onclose popup");
                        reportPopupResult()
                        setIsShowConfirmMessage(false)
                    }}
                >
                    <Toast.Header className={'bg-info'}>
                        <strong className="text-white mr-auto">Alert</strong>
                    </Toast.Header>
                    <Toast.Body className="text-center">
                        <div className="mb-3">
                            Click the here if you are seeing this video
                        </div>
                        <Button variant="info"
                            onClick={() => {
                                Promise.all([
                                    setIsShowConfirmMessage(false),
                                    reportPopupResult(true)
                                ])
                            }}
                        >Cofirm</Button>{' '}
                    </Toast.Body>
                </Toast>
            </div>
                <ReactPlayer
                    className='react-player'
                    url={videoUrl}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    playing={playingVideo}
                    width='100%'
                    height='100%'
                    // controls
                    config={{ file: { 
                        attributes: { 
                            controlsList: 'nodownload'},
                        },
                        onContextMenu: e => e.preventDefault(),
                    }}
                    ref={videoPlayerRef}
                    onPause={(a, b) => onPauseVideo()}
                    onEnded={() => onEndedVideo()}
                    // onStart={() => onStartVideo()}
                    onPlay={() => onStartVideo()}
                />
                <div className={`video-player-controllers text-center pt-2 ${playingVideo && 'd-none'}`}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        fontSize: 50,
                        transform: 'translateX(-50%) translateY(-50%)'
                    }}
                >
                    <FontAwesomeIcon className='cursor-pointer text-info ml-2' size='lg' icon={playingVideo ? faPause : faPlay }  onClick={() => setPlayingVideo(!playingVideo)}/>
                </div>
            </div>
            <div>
                <div className="text-right color-grey">{videoDuration}</div>
                <ProgressBar className="mt-1" animated  variant="info" now={playerProgree} label={`${currentTime} s`} />
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
