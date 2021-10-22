import React from 'react';
import PropTypes from 'prop-types';
import { Button, Overlay, Popover } from 'react-bootstrap';

export const ConfirmPopover = ({ visible, target, setVisibility, label, onConfirm, placement }) => {
    return (
        <Overlay show={visible} target={target} placement={placement} onHide={() => setVisibility(false)} containerPadding={20} rootClose>
            <Popover>
                <Popover.Title as='h3'>Confirm</Popover.Title>
                <Popover.Content>
                    <p className='m-0'>{label}</p>
                    {/* <Button className='my-2 ' variant='secondary' size='sm' onClick={() => setVisibility(false)}>Close</Button> */}
                    <Button className='my-2 float-right' variant='primary' size='sm' onClick={()=> ([onConfirm(), setVisibility(false)])}>Confirm</Button>
                </Popover.Content>
            </Popover>
        </Overlay>
    );
};

ConfirmPopover.propTypes = {
    visible: PropTypes.bool,
    target: PropTypes.object,
    setVisibility: PropTypes.func,
    label: PropTypes.string,
    onConfirm: PropTypes.func,
    placement: PropTypes.oneOf(['right', 'left', 'top', 'bottom'])
};
ConfirmPopover.defaultProps = {
    visible: false,
    target: null,
    setVisibility: () => {},
    label: '',
    onConfirm: () => {},
    placement: 'left'
};
