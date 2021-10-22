import axios from './configuration';

// Constants
import { APIServerURL } from '../constants/default-values';

const BASE_URL = `${APIServerURL}/watch-histories`;
const WahtchHistoryAPI =  {
    getAll: ({ page, perPage, userId }) => {
        let url = `${BASE_URL}?page=${page}&perPage=${perPage}`;
        if (userId) {
            url += `&userId=${userId}`
        }
        return axios.get(url);
    },
    getOne: ({id}) => {
        return axios.get(`${BASE_URL}/${id}`)
    },
    remove: ({id}) => {
        const url = `${BASE_URL}/${id}`;

        return axios.delete(url);
    },
}

export default WahtchHistoryAPI;
