const router = require('express').Router()
const Learning = require('../models/Learning')
const Job = require('../models/Job')
const isSignedIn = require('../middleware/is-signed-in')
const Todo = require('../models/Todo')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()


// page render routes
router.get('/', isSignedIn, async (req,res) => {
    try {
        console.log(req.query);
        
        const filter = {owner: req.session.user._id, isDeleted: false}

        if (req.query.area) {
            filter.area = req.query.area
        }
        if(req.query.query) {
            filter.name = {$regex:req.query.query}
        }

        console.log(filter);
        

        const areaEnums = Learning.schema.path('area').enumValues
        const allLearnings = await Learning.find(filter).populate('linkedJobs')
        res.render('../views/learnings/all-learnings.ejs', {allLearnings, areaEnums})
    }
    catch (error) {console.log(error);}
})

router.get('/new', async (req,res) => {
    try {
        const areaEnums = Learning.schema.path('area').enumValues
        const availableJobs = await Job.find({owner: req.session.user._id})
        res.render('../views/learnings/create-learning.ejs', {areaEnums, availableJobs})
    }
    catch (error) {console.log(error);}
})

router.get('/:learningId', async (req,res) => {
    try {
        const baseFilter = {_id: req.params.learningId, isDeleted: false, owner: req.session.user._id}
        const learning = await Learning.findOne(baseFilter).populate('linkedJobs')
        const todo = await Todo.findOne({entryType: 'Learning', entryId: learning._id, isDeleted: false})
        const notes = md.render(learning.notes)
        res.render('../views/learnings/learning-details.ejs', {learning, todo, notes})
    }
    catch (error) {console.log(error);}
})

router.get('/:learningId/edit', async (req,res) => {
    try {
        const toUpdateLearning = await Learning.findById(req.params.learningId)
        const availableJobs = await Job.find({owner: req.session.user._id})
        const areaEnums = Learning.schema.path('area').enumValues
        res.render('../views/learnings/edit-learning.ejs', {toUpdateLearning, availableJobs, areaEnums})
    }
    catch (error) {console.log(error);}
})

router.get('/:learningId/notes', isSignedIn, async (req,res) => {
    try {
        const baseFilter = {_id: req.params.learningId, owner: req.session.user._id, isDeleted: false}
        const learning = await Learning.findOne(baseFilter)
        const notes = md.render(learning.notes)
        res.render('../views/learnings/notes.ejs', {notes})
    }
    catch (error) {console.log(error);}
})

router.post('/', isSignedIn , async (req,res) => {
    try {
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
    }
    catch (error) {console.log(error);}
})

router.put('/:learningId', async (req,res) => {
    try {
        const updatedLearning = await Learning.findByIdAndUpdate(req.params.learningId, {
            name: req.body.name,
            notes: req.body.notes,
            area: req.body.area,
            resourceLink: req.body.resourceLink,
            linkedJobs: req.body.linkedJobs
        })

        res.redirect('/learnings')
    }
    catch (error) {console.log(error);}
})

router.delete('/:learningId', async (req,res) => {
    try {
        const softDeleteEntry = await Learning.findByIdAndUpdate(req.params.learningId, {isDeleted: true})
        res.redirect('/learnings')
    }
    catch (error) {console.log(error);}
})


module.exports = router