const express=require('express')

const router=express.Router()

const{saveTopic,getTopicBysubCategoreyID,getTopicById,deleteTopicById,patchTopoicById,getTopicsByCategoryID}=require('../controllers/tobiccontroller')

// ===========================================
router.get('/by/:subcategoreyID',getTopicBysubCategoreyID)

router.get('/bycat/:categoreyID', getTopicsByCategoryID);

 router.post('/',saveTopic)

 router.get('/:topicID',getTopicById)

 router.delete('/:topicID',deleteTopicById)

 router.patch('/:topicID',patchTopoicById)

module.exports=router