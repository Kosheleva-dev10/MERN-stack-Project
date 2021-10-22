import axios from 'axios';

// Constants
import { APIServerURL } from '../constants/default-values';

const subTopicsBaseURL = `${APIServerURL}/sub-topics`;
const SubTopicsAPI =  {
    getSubTopics: (topicId) => {
        const url = `${subTopicsBaseURL}/${topicId}`;
        return axios.get(url).then(subTopics => subTopics, e => e);
    },
}

export default SubTopicsAPI;
