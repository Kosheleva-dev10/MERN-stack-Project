import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { withRouter } from 'react-router';

import { LoadingSpinner } from '../../../components/common/spinner';

import ExamBodyAPI from '../../../common/api/exam-bodies';

function AdminSelectExamBody({ history }) {
    const [examBodies, setExamBodies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        ExamBodyAPI.getAllExamBodies().then(arrExamBodies => {
            setExamBodies(arrExamBodies);
            setIsLoading(false);
        }, e => {
            console.log(e);
            setIsLoading(false);
        });
    }, [])

    return (<Container className='pt-4'>
        <Row className='mb-3'>
            <Col>
                <h1 className='text-primary text-center'>
                    Select Exam Body to start
                    </h1>
            </Col>
        </Row>
        {isLoading ? <LoadingSpinner /> : null}
        <Row>
            {examBodies.map((examBody, ebi) =>
                <Col key={ebi} sm={6} md={4} lg={3} className='p-1'>
                    <Card className='w-100 shadow-sm'>
                        <Card.Img className='w-50 mx-auto' variant='top' src={examBody.logoUrl} />
                        <Card.Body>
                            <Card.Title className='text-center'>{examBody.name}</Card.Title>
                            <Button className='float-right' variant='primary'
                                onClick={() => history.push(`/admin/questions/by-exam-body/${examBody.id}`)}>Go</Button>
                        </Card.Body>
                    </Card>
                </Col>
            )}
            <Col sm={6} md={4} lg={3} className='p-1'>
                <Card className='w-100 shadow-sm'>
                    <Card.Img className='w-50 mx-auto' variant='top' src='https://i.ibb.co/g9qh9Ty/instagram-logo-icon-voronezh-russia-january-square-soft-shadow-171161240.jpg' />
                    <Card.Title className='text-center'>&nbsp;</Card.Title>
                    <Card.Body>
                        <Button className='float-right' variant='primary'>Add new Exam Body</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>);
};

AdminSelectExamBody.propTypes = {};
AdminSelectExamBody.defaultProps = {};

export default withRouter(AdminSelectExamBody);
