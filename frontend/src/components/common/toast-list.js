import React from 'react';
import classNames from 'classnames';
import { Toast } from 'react-bootstrap';

import { connectToasts } from '../../common/redux/connects';
import { ToastStatus } from '../../common/enums/toast';

const ToastList = ({ toasts, removeToastAction }) => {
    return (<div style={{ width: 300, position: 'fixed', right: 5, top: 60, zIndex: 9999 }}
        className='d-flex flex-column align-items-end'>
        {toasts.map((toast, ti) =>
        <Toast key={ti} className='w-100' style={{ flexBasis: 'unset' }} animation onClose={() => removeToastAction(toast.id)}>
            <Toast.Header className={classNames({
                'bg-success': toast.status === ToastStatus.Success,
                'bg-danger': toast.status === ToastStatus.Danger,
                'bg-warning': toast.status === ToastStatus.Warning,
                'bg-info': toast.status === ToastStatus.Info,
            })}>
                <strong className="text-white mr-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body>
                {toast.description}
            </Toast.Body>
        </Toast>)}
    </div>
    );
};

export default connectToasts(ToastList);
