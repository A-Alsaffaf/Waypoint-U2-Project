const router = require('express').Router()
const Todo = require('../models/Todo')
const isSignedIn = require('../middleware/is-signed-in')

router.get('/', (req,res) => {
    res.render('../views/todos/all-todos.ejs')
})

router.get('/new', (req,res) => {
    res.render('../views/todos/create-todo.ejs')
})

router.post('/', async (req,res) => {
    console.log(req.body);
    const createTodo = await Todo.create({
        name: req.body.name,
        checkList: req.body.checkList,
        owner: req.session.user._id
    })
    res.redirect('/todos')
})

module.exports = router