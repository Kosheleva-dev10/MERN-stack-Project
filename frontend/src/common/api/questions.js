import axios from 'axios';
import querystring from 'query-string';

// Constants
import { APIServerURL } from '../constants/default-values';
import { QuestionStatus } from '../enums/questions';

const questionsBaseURL = `${APIServerURL}/questions`;
const QuestionsAPI = {
    // Questions Groups Page
    findQuestionGroups: (examBodyId, filterOptions = {}) => {
        const copiedFilterOptions = {};
        for (const key in filterOptions) {
            if (Object.hasOwnProperty.call(filterOptions, key)) {
                const value = filterOptions[key];
                if (!!value) {
                    copiedFilterOptions[key] = value;
                }
            }
        }
        const query = querystring.stringify(copiedFilterOptions);
        const url = `${questionsBaseURL}/group-by/${examBodyId}?${query}`;
        return axios.get(url);
    },
    findAdditionalDetails: (examBodyId, subjectId, year) => {
        const url = `${questionsBaseURL}/group-by/additional-details/${examBodyId}/${subjectId}/${year}`;
        return axios.get(url);
    },
    // Add Questions Page
    initRegisterQuestionsPage: (examBodyId, subjectId) => {
        const url = `${questionsBaseURL}/register/init/${examBodyId}/${subjectId}`;
        return axios.get(url);
    },
    registerQuestion: (rqDto, answers) => {
        const url = `${questionsBaseURL}/register`;
        return axios.post(url, rqDto).then(registerResponse => {
            const { id } = registerResponse;
            return QuestionsAPI.attachAnswers(id, answers)
        });
    },
    attachAnswers: (questionId, answers) => {
        const url = `${questionsBaseURL}/attach-answers/${questionId}`;
        return axios.post(url, { answers });
    },
    // Questions List Page
    findQuestionsByExam: (examBodyId, subjectId, year, objQuery) => {
        const query = {};
        for (const key in objQuery) {
            if (Object.hasOwnProperty.call(objQuery, key)) {
                const value = objQuery[key];
                if (!!value) { query[key] = value;}
            }
        }
        const url = `${questionsBaseURL}/by-exam/${examBodyId}/${subjectId}/${year}?${querystring.stringify(query)}`;
        return axios.get(url);

    },
    requestToPublish: (examBodyId, subjectId, year) => {
        const url = `${questionsBaseURL}/update-exam-status`;
        return axios.put(url, { examBodyId, subjectId, year, status: QuestionStatus.UnderReview });
    },
    publishQuestions: (examBodyId, subjectId, year) => {
        const url = `${questionsBaseURL}/update-exam-status`;
        return axios.put(url, { examBodyId, subjectId, year, status: QuestionStatus.Published });
    },
    // Edit Question Page
    initEditQuestionsPage: (questionId) => {
        const url = `${questionsBaseURL}/update/init/${questionId}`;
        return axios.get(url);
    },
    updateQuestion: (question, answers) => {
        const url = `${questionsBaseURL}/update/${question.id}`;
        return axios.put(url, { question: { ...question, id: null }, answers });
    },
    deleteQuestion: (id) => {
        const url = `${questionsBaseURL}/${id}`;
        return axios.delete(url);
    }
}

export default QuestionsAPI;
