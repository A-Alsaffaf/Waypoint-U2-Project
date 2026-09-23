const router = require('express').Router()
const Job = require('../models/Job')
const Learning = require('../models/Learning')
const Todo = require('../models/Todo')
const isSignedIn = require('../middleware/is-signed-in')

// page render routes
router.get('/', async (req,res) => {
    const allJobs = await Job.find({owner: req.session.user._id, isDeleted: false}) 
    res.render('../views/job/all-jobs.ejs', {allJobs: allJobs})
})

router.get('/new',async (req,res) => {
    const statusElements = Job.schema.path('status').enumValues
    const jobTypes = Job.schema.path('jobType').enumValues
    const applicationMethods = Job.schema.path('applicationMethod').enumValues
    const learningEntries = await Learning.find({owner:req.session.user._id})
    res.render('../views/job/create-job.ejs', {statusElements, jobTypes, applicationMethods, learningEntries})
})

router.get ('/:jobId', async (req,res) => {
    const foundJob = await Job.findById(req.params.jobId)
    res.render('../views/job/job-details.ejs', {foundJob})
})

router.get('/:jobID/edit', async (req,res) => {
    const foundJob = await Job.findById(req.params.jobID)
    const statusElements = Job.schema.path('status').enumValues
    const jobTypes = Job.schema.path('jobType').enumValues
    const applicationMethods = Job.schema.path('applicationMethod').enumValues
    const learningEntries = await Learning.find({owner:req.session.user._id})
    res.render('../views/job/edit-job.ejs', {statusElements, jobTypes, applicationMethods, learningEntries, foundJob})
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

router.put('/:jobId', isSignedIn , async (req,res) => {
    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, {
        title: req.body.title,
        company: req.body.company,
        jobType: req.body.jobType,
        status: req.body.status,
        postingLink: req.body.postingLink,
        salary: req.body.salary,
        location: req.body.location,
        applicationMethod: req.body.applicationMethod,
        learningEntries: req.body.learningEntries,
    })
    res.redirect(`/jobs/${req.params.jobId}`)
})

router.delete('/:jobId', async (req,res) => {
    const softDeletedJob = await Job.findByIdAndUpdate(req.params.jobId, {isDeleted: true})
    res.redirect('/jobs')
})



module.exports = router