import axios from './configuration';

// Constants
import { APIServerURL } from '../constants/default-values';

const VIDEOS_BASE_URL = `${APIServerURL}/videos`;
const VideosAPI = {
    addVideo: ({ title, file }) => {
        let formData = new FormData();
        const url = `${VIDEOS_BASE_URL}`;

        formData.append('title', title);
        formData.append('file', file);

        return axios.post(url, formData);
    },
    getVideos: ({ page, perPage }) => {
        const url = `${VIDEOS_BASE_URL}?page=${page}&perPage=${perPage}`;
        return axios.get(url);
    },
    getVideo: ({ id }) => {
        return axios.get(`${VIDEOS_BASE_URL}/${id}`)
    },
    updateVideo: ({ id, title, file }) => {
        let formData = new FormData();
        const url = `${VIDEOS_BASE_URL}/${id}/update`;

        formData.append('title', title);
        formData.append('file', file);
        return axios.put(url, formData);
    },
    remove: ({ id }) => {
        const url = `${VIDEOS_BASE_URL}/${id}`;

        return axios.delete(url);
    },
    removeVideo: ({ id }) => {
        const url = `${VIDEOS_BASE_URL}/${id}`;
        return axios.delete(`${url}/video`)
    }
}

export default VideosAPI;
