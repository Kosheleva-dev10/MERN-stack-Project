import axios from './configuration';

// Constants
import { APIServerURL } from '../constants/default-values';

const BASE_URL = `${APIServerURL}/popup-histories`;
const PopupHistoryAPI =  {
    getOne: ({id}) => {
        return axios.get(`${BASE_URL}/${id}`)
    },
    remove: ({id}) => {
        const url = `${BASE_URL}/${id}`;

        return axios.delete(url);
    },
}

export default PopupHistoryAPI;
