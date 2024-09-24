const express=require('express')

const router=express.Router()

const{saveTopic,getTopic,getTopicById,deleteTopicById,patchTopoicById}=require('../controllers/tobiccontroller')

// ===========================================
router.get('/',getTopic)

 router.post('/',saveTopic)

 router.get('/:topicID',getTopicById)

 router.delete('/:topicID',deleteTopicById)

 router.patch('/:topicID',patchTopoicById)

module.exports=router