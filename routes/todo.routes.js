const router = require('express').Router()
const Todo = require('../models/Todo')
const isSignedIn = require('../middleware/is-signed-in')

// ================= render pages routes =================
router.get('/', async (req,res) => {
    try {
    const standAloneTodos = await Todo.find({owner: req.session.user._id, isDeleted: false, entryType: null})
    const jobTodos = await Todo.find({owner: req.session.user._id, isDeleted: false, entryType: 'Job'}).populate('entryId')
    const learningTodos = await Todo.find({owner: req.session.user._id, isDeleted: false, entryType: 'Learning'}).populate('entryId')
    res.render('../views/todos/all-todos.ejs', {standAloneTodos, jobTodos, learningTodos})
    }
    catch (error) {
        res.send(error)
        console.log(error);
    }
})

router.get('/new', (req,res) => {
    res.render('../views/todos/create-todo.ejs')
})

router.get('/:todoId', async (req,res) => {
    const foundTodo = await Todo.findOne({_id:req.params.todoId, isDeleted:false})
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

    if (req.body.from === 'detail' && updatedTodo.entryType === 'Learning') {
        return res.redirect(`/learnings/${updatedTodo.entryId}`)
    }
    if (req.body.from === 'detail' && updatedTodo.entryType === 'Job') {
        return res.redirect(`/jobs/${updatedTodo.entryId}`)
    }
    res.redirect(`/todos/${req.params.todoId}`)
})

module.exports = router

router.delete('/:todoId', async (req,res) => {
    const deletedTodo = await Todo.findByIdAndUpdate(req.params.todoId, {isDeleted: true})
    res.redirect('/todos')
})