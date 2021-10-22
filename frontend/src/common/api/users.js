import axios from './configuration';

// Constants
import { APIServerURL } from '../constants/default-values';

const BASE_URL = `${APIServerURL}/users`;
const UserAPI = {
    createOne: ({ email, gender, fullName, password }) => {
        return axios.post(`${BASE_URL}`, {
            email, gender, fullName, password
        })
    },
    getAll: ({ page, perPage }) => {
        const url = `${BASE_URL}?page=${page}&perPage=${perPage}`;
        return axios.get(url);
    },
    allUsers: () => {
        const url = `${BASE_URL}`;
        return axios.get(url);
    },
    getOne: ({ id }) => {
        return axios.get(`${BASE_URL}/${id}`)
    },
    updateOne: ({ id, email, fullName, gender }) => {
        const url = `${BASE_URL}/${id}/update`;

        return axios.put(url, { email, fullName, gender });
    },
    removeOne: ({ id }) => {
        const url = `${BASE_URL}/${id}`;

        return axios.delete(url);
    },
}

export default UserAPI;
