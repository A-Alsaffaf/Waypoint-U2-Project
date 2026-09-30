const router = require("express").Router()

const Job = require('../models/Job')
const Learning = require('../models/Learning')
const Todo = require('../models/Todo')


router.get('/', async(req,res)=>{
    const owner = req.session.user._id;

    // counters for header cards
    const appliedCount = await Job.countDocuments({ owner, isDeleted: false, status: 'Applied' });
    const interviewCount = await Job.countDocuments({ owner, isDeleted: false, status: 'Interview' });
    const offerCount = await Job.countDocuments({ owner, isDeleted: false, status: 'Offer' });
    const openTodoCount = await Todo.countDocuments({
    owner,
    isDeleted: false,
    checkList: { $elemMatch: { isChecked: false } },
    });

    const recentJobs = await Job.find({ owner, isDeleted: false }).sort({ createdAt: -1 }).limit(3);
    const recentLearnings = await Learning.find({ owner, isDeleted: false }).sort({ createdAt: -1 }).limit(3);
    const upcomingTodos = await Todo.find({
        owner,
        isDeleted: false,
        checkList: { $elemMatch: { isChecked: false } },
    }).sort({ createdAt: -1 }).limit(3);

    const mine = await Todo.find({ owner });
    console.log(mine);

    res.render('homepage.ejs', {
        appliedCount,
        interviewCount,
        offerCount,
        openTodoCount,
        recentJobs,
        recentLearnings,
        upcomingTodos,
    })
})
module.exports = router;
