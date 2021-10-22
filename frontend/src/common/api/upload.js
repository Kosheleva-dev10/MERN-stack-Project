import axios from 'axios';

// Constants
import { APIServerURL, AssetsServerURL } from '../constants/default-values';

const UploadAPI = {
    uploadFile: file => {
        const url = `${APIServerURL}/uploads/shapes`;
        const form = new FormData();
        form.append('file', file);
        return axios.post(url, form).then(res => `${AssetsServerURL}/${res.url}`);
    }
}

export default UploadAPI;