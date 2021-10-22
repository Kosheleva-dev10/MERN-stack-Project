import axios from 'axios';

// Constants
import { APIServerURL } from '../constants/default-values';

const subjectsBaseURL = `${APIServerURL}/subjects`;
const SubjectsAPI =  {
    getAllSubjects: () => {
        const url = `${subjectsBaseURL}`;
        return axios.get(url).then(subjects => subjects, e => e);
    },
}

export default SubjectsAPI;
