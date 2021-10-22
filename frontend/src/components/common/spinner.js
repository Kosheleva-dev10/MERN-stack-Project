import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';

export const LoadingSpinner = (absolute) => {
    return (<Fragment>
        { absolute ?
            <div className='d-flex'><Spinner animation='border' variant='primary' className='w-4rem h-4rem m-auto' /></div> :
            <Spinner animation='border' variant='primary' className='w-4rem h-4rem' style={{ position: 'absolute', left: '50%', top: '50%' }} />
        }
    </Fragment>
    );
};
LoadingSpinner.propTypes = {
    absolute: PropTypes.bool
};
LoadingSpinner.defaultProps = {
    absolute: false
};

export const PageLoadingSpinner = () => {
    return (
        <div className='d-flex' style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0000008a', zIndex: 10
        }}>
            <Spinner animation='border' variant='primary' className='w-4rem h-4rem m-auto' />
        </div>
    );
};
PageLoadingSpinner.propTypes = {};
PageLoadingSpinner.defaultProps = {};
