/*
    Our http api, which we use to send requests to
    our back-end API. 
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const apiMain = process.env.REACT_APP_BACK_URI + '/api';
const api = axios.create({
    baseURL: apiMain,
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING
export const createPlaylist = (newListName, newSongs, userEmail, userName) => {
    return api.post(`/playlist/`, {
        // SPECIFY THE PAYLOAD
        name: newListName,
        age: undefined,
        ownerName: userName,
        ownerEmail: userEmail,
        published: false,
        likes: 0,
        dislikes: 0,
        comments: [],
        songs: newSongs
    })
}
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const getPlaylistPairs = (type) => {
    console.log("TYPE: " + type);
    //if(type == null || type == undefined) return {data: {success: false}};
    return api.get(`/playlistpairs/${type}`);
}
export const updatePlaylistById = (id, playlist) => {
    return api.put(`/playlist/${id}`, {
        // SPECIFY THE PAYLOAD
        playlist : playlist
    })
}
export const getSearchPairs = (term, type) => {
    return api.put(`/search`, {
        // SPECIFY THE PAYLOAD
        term : term,
        type : type
    })
}

export const likePlaylistById = (id, lt, email) => {
    return api.put(`/like`, {
        // SPECIFY THE PAYLOAD
        id : id,
        lt : lt,
        email: email
    })
}

export const addCommentById = (msg, name, id) => {
    return api.put(`/comment`, {
        // SPECIFY THE PAYLOAD
        id : id,
        name : name,
        msg : msg
    })
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById,
    getSearchPairs,
    likePlaylistById,
    addCommentById
}

export default apis
