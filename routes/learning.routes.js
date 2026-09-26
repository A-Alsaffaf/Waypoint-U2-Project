const router = require('express').Router()
const Learning = require('../models/Learning')
const Job = require('../models/Job')
const isSignedIn = require('../middleware/is-signed-in')
const Todo = require('../models/Todo')


// page render routes
router.get('/', isSignedIn, async (req,res) => {
    const allLearnings = await Learning.find({owner: req.session.user._id, isDeleted: false}).populate('linkedJobs')
    res.render('../views/learnings/all-learnings.ejs', {allLearnings})
})

router.get('/new', async (req,res) => {
    const areaEnums = Learning.schema.path('area').enumValues
    const availableJobs = await Job.find({owner: req.session.user._id})
    res.render('../views/learnings/create-learning.ejs', {areaEnums, availableJobs})
})

router.get('/:learningId', async (req,res) => {
    const foundLearning = await Learning.findById(req.params.learningId)
    res.render('../views/learnings/learning-details.ejs', {foundLearning})
})

router.get('/:learningId/edit', async (req,res) => {
    const toUpdateLearning = await Learning.findById(req.params.learningId)
    const availableJobs = await Job.find({owner: req.session.user._id})
    const areaEnums = Learning.schema.path('area').enumValues
    res.render('../views/learnings/edit-learning.ejs', {toUpdateLearning, availableJobs, areaEnums})
})

router.post('/', isSignedIn , async (req,res) => {
    const todoName = `${req.body.name}-${req.body.area}-Todo`

    const createdLearning = await Learning.create({
        name: req.body.name,
        notes: req.body.notes,
        area: req.body.area,
        resourceLink: req.body.resourceLink,
        linkedJobs: req.body.linkedJobs,
        owner: req.session.user._id
    })

    const createLinkedTodo = await Todo.create({
        name: todoName,
        checkList: [],
        entryType: "Learning",
        entryId: createdLearning._id,
        owner: req.session.user._id
    })

    const updateLearning = await Learning.findByIdAndUpdate(createdLearning._id, {
        todo: createLinkedTodo._id
    })

    res.redirect('/learnings')
})

router.put('/:learningId', async (req,res) => {
    const updatedLearning = await Learning.findByIdAndUpdate(req.params.learningId, {
        name: req.body.name,
        notes: req.body.notes,
        area: req.body.area,
        resourceLink: req.body.resourceLink,
        linkedJobs: req.body.linkedJobs
    })

    res.redirect('/learnings')
})

router.delete('/:learningId', async (req,res) => {
    const softDeleteEntry = await Learning.findByIdAndUpdate(req.params.learningId, {isDeleted: true})
    res.redirect('/learnings')
})


module.exports = router