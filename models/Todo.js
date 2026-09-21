const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
        trim: true
    },
    checkList: [{
        description: {
            type: String, 
            required: true,  
            trim: true
        },
        isChecked: {
            type: Boolean,
            default: false
        }
    }],
    entryType: {
        type: String,
        enum: ['Job', 'Learning'],
        default: null
    },
    entryId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'entryType',
        default: null
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo