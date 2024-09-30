const express=require('express')

const router=express.Router()

const{getSubcategoreyByCategoreyID,saveSubcategorey,getSubcategoreyById,deleteSubcategoreyById,patchSubcategoreyById}=require('../controllers/subcategoreycontroller')

// ===========================================
router.get('/by/:categoreyID',getSubcategoreyByCategoreyID)

 router.post('/',saveSubcategorey)

 router.get('/:id',getSubcategoreyById)

 router.delete('/:id',deleteSubcategoreyById)

 router.patch('/:id',patchSubcategoreyById)

module.exports=router