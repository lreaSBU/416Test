/*
    Our http api for all things auth, which we use to 
    send authorization requests to our back-end API.
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const authMain = process.env.REACT_APP_BACK_URI + '/auth';
const api = axios.create({
    baseURL: authMain,
    withCredentials: true
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (firstName, lastName, email, password, passwordVerify) => {
    return api.post(`/register/`, {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password,
        passwordVerify : passwordVerify
    })
}
export const requestRecovery = (email) => {
    return api.post(`/recover/`, {
        email: email
    })
}
export const verifyCode = (email, code, password, password2) => {
    return api.post(`/verify/`, {
        email: email,
        code: code,
        password: password,
        password2: password2
    })
}

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    requestRecovery,
    verifyCode
}

export default apis
