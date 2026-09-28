const router = require('express').Router()
const Todo = require('../models/Todo')
const isSignedIn = require('../middleware/is-signed-in')

// ================= render pages routes =================
router.get('/', (req,res) => {
    res.render('../views/todos/all-todos.ejs')
})

router.get('/new', (req,res) => {
    res.render('../views/todos/create-todo.ejs')
})

router.get('/:todoId', async (req,res) => {
    const foundTodo = await Todo.findById(req.params.todoId)
    res.render('../views/todos/view-edit-todo.ejs', {foundTodo})
})

// ================= form submission routes =================

router.post('/', async (req,res) => {
    console.log(req.body);
    const createTodo = await Todo.create({
        name: req.body.name,
        checkList: req.body.checkList,
        owner: req.session.user._id
    })
    res.redirect('/todos')
})

router.put('/:todoId', async (req,res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.todoId, {
        checkList: req.body.checkList
    })
    res.redirect(`/todos/${req.params.todoId}`)
})

module.exports = router