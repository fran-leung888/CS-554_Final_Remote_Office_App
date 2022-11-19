const router = require('express').Router()
const users = require('../data/users')
const store = require('../store/dataStore')
const response = require('../response/response')


router.post('/user', async (req, res) => {
    const name = req.body.name
    const username = req.body.username
    const password = req.body.passwd
    try {
        const user = await users.addUser(name, username, password)
        res.send(new response(user).success(res))
    } catch (e) {
        res.send(new response(null, e).fail(res))
    }
})

router.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.passwd
    try {
        const user = await users.login(username, password)
        let sessions = store.get(store.SESSION_KEY)
        if (sessions == undefined)
            sessions = new Set([])

        sessions.add(user._id.toString())
        store.set(store.SESSION_KEY, sessions)
        res.cookie(store.SESSION_KEY, user._id.toString());
        res.send(new response(user).success(res))
    } catch (e) {
        res.send(new response(null, e).fail(res))
    }
});

router.get('/user', async (req, res) => {
    const name = req.query.name
    const id = req.query.id
    console.log(req.query)
    try {
        if(!name && !id)
            throw 'Bad request.'
        let user = null
        if(id)
            user = await users.getUser(id)
        else if(name)
            user = await users.getUserByname(name)
        res.send(new response(user).success(res))
    } catch (e) {
        res.send(new response(null, e).fail(res))
    }
});

module.exports = router