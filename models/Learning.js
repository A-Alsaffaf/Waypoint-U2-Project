const mongoose = require('mongoose')


const learningSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    notes: {
        type: String, 
    }, 
    area: {
        type: String,
        enum: ['Networking', 'Programming', 'Machine Learning',' Cybersecurity', 'other']
    },
    resourceLink: {
        type: String,
    },
    Todo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    },
    linkedJob: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Job',
        default: []
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const Learning = mongoose.model('Learning', learningSchema)

module.exports = Learning