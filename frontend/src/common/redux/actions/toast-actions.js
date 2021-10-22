import {
    TOAST_ADD,
    TOAST_REMOVE,
    TOAST_REMOVE_ALL,
} from './types';
import { ToastStatus } from '../../enums/toast';

export const addToast = (title, description, status = ToastStatus.Info) => ({ type: TOAST_ADD, payload: {
    title,
    description,
    status,
    id: `toast-${new Date().getTime()}`
}});
export const removeToast = id => ({ type: TOAST_REMOVE, payload: { id } });
export const removeAllToasts = () => ({ type: TOAST_REMOVE_ALL });
