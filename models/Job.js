const  mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
        default: 'Full-Time' 
    },
    status: {
        type: String,
        enum: ['Applied', 'Saved', 'Interview', 'Scheduled', 'Interviewed', 'Rejected', 'Ghosted', "Offer"],
        required: true
    },
    postingLink: {
        type: String,
    },
    Salary: {
        type: Number,
        default: null
    },
    location: {
        type: String,
    },
    applicationMethod: {
        type: String,
        enum: ['LinkedIn', 'Indeed', 'MOL', 'Company Website', 'Email', 'Referral', 'Manual',  'other']
    }, 
    isDeleted: {
        type: Boolean,
        default: false
    },
    todo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
    },
    learningEntry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LearningEntry'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job