/*
    Our http api, which we use to send requests to
    our back-end API. 
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const apiMain = process.env.REACT_APP_BACK_URI + '/api';
const api = axios.create({
    baseURL: apiMain,
    withCredentials: true
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createMap = (newName, user) => {
    return api.post(`/map/`, {
        name: newName,
        owner: user
    })
}
export const getMapById = (id) => api.get(`/map/${id}`)
export const updateMapById = (id, map) => {
    return api.put(`/map/${id}/`, {
        id: id,
        map: map
    })
}
export const deleteMapById = (id) => api.delete(`/map/${id}`)
export const getMapPairs = (filter, searchMode, sortMode, page) => {
    console.log("TYPE: " + searchMode);
    //if(type == null || type == undefined) return {data: {success: false}};
    return api.put(`/mappairs/`, {
        filter: filter,
        searchMode: searchMode,
        sortMode: sortMode,
        page: page
    });
}
export const getConvoPairs = (page) => {
    return api.put(`/convopairs/`, {
        page: page
    });
}

const apis = {
    createMap,
    getMapById,
    updateMapById,
    deleteMapById,
    getMapPairs,
    getConvoPairs
}

export default apis
