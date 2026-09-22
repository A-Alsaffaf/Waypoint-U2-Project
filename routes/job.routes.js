const router = require('express').Router()
const Job = require('../models/Job')
const Learning = require('../models/Learning')
const Todo = require('../models/Todo')

// page render routes
router.get('/', (req,res) => {
    res.render('../views/job/all-jobs.ejs')
})

router.get('/new',async (req,res) => {
    const statusElements = Job.schema.path('status').enumValues
    const jobTypes = Job.schema.path('jobType').enumValues
    const applicationMethods = Job.schema.path('applicationMethod').enumValues
    const learningEntries = await Learning.find({owner:req.session.user._id})
    res.render('../views/job/create-job.ejs', {statusElements, jobTypes, applicationMethods, learningEntries})
})

// form submission routes
router.post('/', async (req,res) => {
    const todoName = `${req.body.titel}-${req.body.company}-Todo`
    
    const createdJob = await Job.create({
        title: req.body.title,
        company: req.body.company,
        jobType: req.body.jobType,
        status: req.body.status,
        applicationMethod: req.body.applicationMethod,
        salary: req.body.salary,
        postingLink: req.body.postingLink,
        location: req.body.location,
        learningEntries: req.body.learningEntries,
        owner: req.session.user._id
    })

    const createLinkedTodo = await Todo.create({
        name: todoName,
        checkList: [],
        entryType: "Job",
        entryId: createdJob._id,
        owner: req.session.user._id
    })

    const updateJob = await Job.findByIdAndUpdate(createdJob._id, {
        todo: createLinkedTodo._id
    })
    res.redirect('/jobs')
})

module.exports = router