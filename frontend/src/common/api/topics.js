import axios from 'axios';

// Constants
import { APIServerURL } from '../constants/default-values';

const topicsBaseURL = `${APIServerURL}/topics`;
const TopicsAPI =  {
    getTopics: (subjectId) => {
        const url = `${topicsBaseURL}/${subjectId}`;
        return axios.get(url).then(topics => topics, e => e);
    },
}

export default TopicsAPI;
