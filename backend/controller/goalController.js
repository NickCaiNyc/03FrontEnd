const Goal = require('../models/goalModel')
//new
const User = require('../models/userModel') 

const asyncHandler = require('express-async-handler')
//functions to get goals
const getGoal = asyncHandler(async(req, res) =>{
    const goal = await Goal.find({user: req.user.id}) //difference from before is now we want goals assocaited with goal
    res.status(200).json({goal})
})

const setGoal = asyncHandler(async (req, res) => {
    // console.log(req.body)
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add Goal') //errorMiddle.js
    }

    const a = await Goal.create({ //step 8 setting up connection with mongo to take in from it and output from it
        text: req.body.text,
        user: req.user.id //need this user path i guess
    })

    res.status(200).json({a})
})

const updateGoal = asyncHandler(async(req, res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Please add new text field on postman')
    }


    const user = await User.findById(req.user.id) //new
    //BASIC IDEA
    //If user is logged into as A and want to change goal of B cant, need the token of A and the id of 
    //A goal not B goal

    //check for user
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    //make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorizeed to edit')
    }


    const updateGoals = await Goal.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({updateGoals})
})


const deleteGoal = asyncHandler(async(req, res) =>{
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Please add new text field on postman')
    }
    

    //step 6 make sure that one user can't edit someone else's goals
    const user = await User.findById(req.user.id) //new
    //check for user
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    //make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorizeed to delete')
    }


    const deletedgoal = await Goal.findByIdAndRemove(req.params.id)
    res.status(200).json({deletedgoal})
})

module.exports = {
    getGoal,
    setGoal,
    updateGoal,
    deleteGoal
}