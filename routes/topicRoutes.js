const express=require('express')

const router=express.Router()

const{saveTopic,getTopicBysubCategoreyID,getTopicById,deleteTopicById,patchTopoicById,getTopicsByCategoryID,getTopicByName}=require('../controllers/tobiccontroller')

// ===========================================
router.get('/by/:subcategoreyID',getTopicBysubCategoreyID)

router.get('/bycat/:categoreyID', getTopicsByCategoryID);
router.get('/byname/:name', getTopicByName);


 router.post('/',saveTopic)

 router.get('/:topicID',getTopicById)

 router.delete('/:topicID',deleteTopicById)

 router.patch('/:topicID',patchTopoicById)

module.exports=router