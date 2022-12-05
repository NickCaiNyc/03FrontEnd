const express = require('express')
const router = express.Router()


const {getGoal,setGoal,updateGoal,deleteGoal} = require('../controller/goalController')


const {protect} = require('../middleware/authMiddleware')
//get //post
router.route('/').get(protect,getGoal).post(protect,setGoal) //protect step 4 needs token to access
//put //delete
router.route('/:id').put(protect,updateGoal).delete(protect,deleteGoal)
//step 5 protect
module.exports = router
