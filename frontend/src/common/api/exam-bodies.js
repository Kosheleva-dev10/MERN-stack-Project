import axios from './configuration';

// Constants
import { APIServerURL } from '../constants/default-values';

const examBodiesBaseURL = `${APIServerURL}/exam-bodies`;
const ExamBodiesAPI =  {
    getAllExamBodies: () => {
        const url = `${examBodiesBaseURL}`;
        return axios.get(url);
    },
    getExamBodyById: (examBodyId) => {
        const url = `${examBodiesBaseURL}/by-id/${examBodyId}`;
        return axios.get(url);
    }
}

export default ExamBodiesAPI;
