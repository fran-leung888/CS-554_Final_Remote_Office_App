import axios from '../config/axios'

const addUser = async (name, username, passwd) => {
    let response = await axios.post('/user', {
        name,
        username,
        passwd
    })
    return response
}

const login = async (username, passwd) => {
    let response = await axios.post('/login', {
        username,
        passwd
    })

    return response
}

const searchUser = async (name) => {
    let response = await axios.get('/user?name=' + name)

    return response
}

export default {
    addUser,
    login,
    searchUser
}