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

export const sendEdit = (id, tn, typ, fl, gn, pn, od, nd) => {
    return api.put(`/edit/`, {
        mid: id,
        tid: tn,
        type: typ,
        layer: fl,
        subregion: gn,
        poly: pn,
        oldData: od,
        newData: nd
    })
}

const apis = {
    getStartData,
    sendEdit
}

export default apis