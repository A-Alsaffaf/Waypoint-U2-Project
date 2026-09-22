const router = require('express').Router()
const Job = require('../models/Job')

// page render routes
router.get('/', (req,res) => {
    res.render('../views/job/all-jobs.ejs')
})

router.get('/new', (req,res) => {
    const statusElements = Job.schema.path('status').enumValues
    const jobTypes = Job.schema.path('jobType').enumValues
    const applicationMethods = Job.schema.path('applicationMethod').enumValues
    res.render('../views/job/create-job.ejs', {statusElements, jobTypes, applicationMethods})
})

// form submission routes
router.post('/', async (req,res) => {
    const createdJob = await Job.create({
        title: req.body.title,
        company: req.body.company,
        jobType: req.body.jobType,
        status: req.body.status,
        applicationMethod: req.body.applicationMethod,
        salary: req.body.salary,
        postingLink: req.body.postingLink,
        location: req.body.location,

    })
})

module.exports = router