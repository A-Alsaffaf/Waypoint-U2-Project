const router = require('express').Router()
const Todo = require('../models/Todo')
const isSignedIn = require('../middleware/is-signed-in')

router.get('/', (req,res) => {
    res.render('../views/todos/all-todos.ejs')
})

router.get('/new', (req,res) => {
    res.render('../views/todos/create-todo.ejs')
})


module.exports = router