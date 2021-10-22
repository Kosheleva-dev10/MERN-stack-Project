import React from 'react';
import { withRouter } from 'react-router';

function CustomerDashboard() {

    return (
        <div className='bg-primary py-100 text-center'>
            <span className='display-4'>Customer Dashboard</span>
        </div>
    );
};

CustomerDashboard.propTypes = {};
CustomerDashboard.defaultProps = {};

export default withRouter(CustomerDashboard);
