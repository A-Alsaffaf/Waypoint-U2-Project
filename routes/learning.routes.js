const router = require('express').Router()
const Learning = require('../models/Learning')
const Job = require('../models/Job')
const isSignedIn = require('../middleware/is-signed-in')

router.get('/', (req,res) => {
    res.render('../views/learnings/all-learnings.ejs')
})

router.get('/new', async (req,res) => {
    const areaEnums = Learning.schema.path('area').enumValues
    const availableJobs = await Job.find({owner: req.session.user._id})
    res.render('../views/learnings/create-learning.ejs', {areaEnums, availableJobs})
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