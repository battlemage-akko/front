import axios from "@/api/http/request"

export const login = (data) => {
    return axios({
        url: 'api/login/',
        method: 'POST',
        data,
    })
}

export const signUp = (data) => {
    return axios({
        url: 'api/register/',
        method: 'POST',
        data,
    })
}

export const logout = (data) => {
    return axios({
        url: 'api/logout/',
        method: 'POST',
        data,
    })
}

export const getCode = (data) => {
    return axios({
        url: 'api/getCode/',
        method: 'POST',
        data,
    })
}

export const check = (data) => {
    return axios({
        url: 'api/check/',
        method: 'POST',
        data,
    })
}