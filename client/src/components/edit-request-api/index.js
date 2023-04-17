import axios from 'axios'
axios.defaults.withCredentials = true;
const apiMain = process.env.REACT_APP_BACK_URI + '/api';
const api = axios.create({
    baseURL: apiMain,
    withCredentials: true
})

export const getStartData = (id) => {
    return api.put(`/start/`, {
        id: id
    })
}

const apis = {
    getStartData
}

export default apis