const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const User = require('../models/User.js')
const Job = require('../models/Job.js')
const Learning = require('../models/Learning.js')
const Todo = require('../models/Todo.js')

let mongoServer

// runs once before all tests: spins up the fake in-memory DB and connects
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

// runs once after all tests: disconnects and shuts the fake DB down
afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

// runs after EACH test: wipes all collections so tests don't affect each other
afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
})

// --- example test, so you can see the pattern ---
test('A job can be created with required fields', async () => {
    const user = await User.create({ username: 'ahmed', password: 'hashedpw' })

    const job = await Job.create({
        title: 'Backend Dev',
        company: 'Acme',
        status: 'Applied',
        owner: user._id
    })

    expect(job.title).toBe('Backend Dev')
    expect(job.learningEntries).toHaveLength(0) // default empty array
})

// tests created by the developer

test('A Learning can be created with required fields', async () => {
    const user = await User.create({ username: 'hashem', password: 'hashedpw123' })

    const learning = await Learning.create({
        name: 'STAR Method', 
        owner: user._id
    })

    await learning.populate('owner')

    expect(learning.area).toBe('other')
    expect(learning.linkedJobs).toHaveLength(0) // default empty array 
    expect(learning.owner.username).toBe('hashem')
})

test('A Todo can be created with required fields', async () => {
    const user = await User.create({ username: 'Ali', password: 'Alipw123' })

    const todo  = await Todo.create({
        name: 'Interview Prep', 
        checkList: [
            {description: 'Read the About page in the company website'},
            {description: 'Brainstorm with Ai about possible technical questions', isChecked: true}
        ],
        owner: user._id
    })

    await todo.populate('owner')

    expect(todo.checkList).toHaveLength(2) // the array should have 2 objects
    expect(todo.checkList[0].isChecked).toBe(false)
    expect(todo.checkList[1].isChecked).toBe(true)
    expect(todo.entryType).toBe(null)
    expect(todo.entryId).toBe(null)
    expect(todo.owner.username).toBe('Ali')
})

test('A job can be created with a learning entry linked to it', async () => {
    const user = await User.create({ username: 'Abdullah', password: 'March2003PW' })

    const learning = await Learning.create({
        name: 'Syslog Server Setup',
        area: 'Networking',
        owner: user._id
    })
    const learning2 = await Learning.create({
        name: 'Active Directory Permissions',
        area: 'Cybersecurity',
        owner: user._id
    })

    const job = await Job.create({
        title: 'System Admin',
        company: '01 systems',
        status: 'Applied',
        applicationMethod: 'Company Website',
        learningEntries: [learning._id, learning2._id],
        owner: user._id
    })

    await job.populate('owner learningEntries')

    expect(job.jobType).toBe('Full-Time')
    expect(job.status).toBe('Applied')
    expect(job.applicationMethod).toBe('Company Website')
    expect(job.learningEntries).toHaveLength(2) // array should have 2 Entries
    expect(job.learningEntries[0].area).toBe('Networking')
    expect(job.learningEntries[0].owner.toString()).toBe(String(user._id))
    expect(job.learningEntries[1].area).toBe('Cybersecurity')
    expect(job.learningEntries[1].owner.toString()).toBe(String(user._id))
    expect(job.owner.username).toBe('Abdullah')
})

test('A learning entry can be created with a job entry linked to it', async () => {
    const user = await User.create({ username: 'Hamed', password: 'hPW123' })

    const job = await Job.create({
        title: 'System Admin',
        company: '01 systems',
        status: 'Applied',
        applicationMethod: 'Company Website',
        owner: user._id
    })

    const job2 = await Job.create({
        title: 'Software Engineer',
        company: 'JP Morgan',
        status: 'Ghosted',
        applicationMethod: 'Email',
        owner: user._id
    })

    const learning = await Learning.create({
        name: 'Syslog Server Setup',
        area: 'Networking',
        linkedJobs: [job._id, job2._id],
        owner: user._id
    })
    

    await learning.populate('owner linkedJobs')

    expect(learning.name).toBe('Syslog Server Setup')
    expect(learning.area).toBe('Networking')
    expect(learning.linkedJobs).toHaveLength(2)
    expect(learning.owner.username).toBe('Hamed')
    expect(learning.linkedJobs[0].title).toBe('System Admin')
    expect(learning.linkedJobs[1].status).toBe('Ghosted')
})

test('A todo can only be linked to one job or one learning entry', async() => {

    const user = await User.create({username: 'Ammar', password: 'ammaroPW123'})

    const job = await Job.create({
        title: 'System Admin',
        company: '01 systems',
        status: 'Applied',
        applicationMethod: 'Company Website',
        owner: user._id
    })

    const learning = await Learning.create({
        name: 'Creating Lambda functions',
        area: 'Programming',
        owner: user._id
    })

    const aws = await Todo.create({
        name: 'Udemy AWS CSA Course',
        checkList: [
            {description: 'watch first 3 lectures on 10/10/2026'},
            {description: 'setup AWS free tier account'},
            {description: 'do the first lab'}
        ],
        entryType: 'Learning',
        entryId: learning._id,
        owner: user._id
    })

    const prep = await Todo.create({
        name: 'Bapco Interview prep',
        checkList: [
            {description: 'Visit the about page in the company website'},
            {description: 'understand the company workflow and activities'},
            {description: 'email the company to requests more info'}
        ],
        entryType: 'Job',
        entryId: job._id,
        owner: user._id
    })

    await aws.populate('owner entryId')

    expect(aws.entryId.name).toBe('Creating Lambda functions')
    expect(aws.checkList).toHaveLength(3)
    expect(prep.entryId).toBe(job._id)
    expect(prep.checkList).toHaveLength(3)
})