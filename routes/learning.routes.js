const router = require('express').Router()
const Learning = require('../models/Learning')
const Job = require('../models/Job')
const isSignedIn = require('../middleware/is-signed-in')
const { find } = require('../models/Todo')


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
    const updatedLearning = await Learning.findById(req.params.learningId)
})

router.post('/', isSignedIn , async (req,res) => {
    const createdLearning = await Learning.create({
        name: req.body.name,
        notes: req.body.notes,
        area: req.body.area,
        resourceLink: req.body.resourceLink,
        linkedJobs: req.body.linkedJobs,
        owner: req.session.user._id
    })

    res.redirect('/learnings')
})




module.exports = router