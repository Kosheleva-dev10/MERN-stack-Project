import {
    TOAST_ADD,
    TOAST_REMOVE,
    TOAST_REMOVE_ALL,
} from '../actions/types';

const initialToastState = {
    toasts: []
};

const toastReducer = (state = initialToastState, action) => {
    switch (action.type) {
        case TOAST_ADD:
            return {
                toasts: state.toasts.concat([{
                    id: action.payload.id,
                    title: action.payload.title,
                    status: action.payload.status,
                    description: action.payload.description,
                    createdAt: new Date()
                }])
            };
        case TOAST_REMOVE:
            const newToasts = JSON.parse(JSON.stringify(state.toasts));
            const index = newToasts.findIndex(toast => toast.id === action.payload.id);
            if (index >= 0) {
                newToasts.splice(index, 1);
                return { toasts: newToasts };
            }
            return state;
        case TOAST_REMOVE_ALL:
            return { toasts: [] };
        default:
            return state;
    }
};

export default toastReducer;
