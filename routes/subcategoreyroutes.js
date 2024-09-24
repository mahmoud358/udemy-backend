const express=require('express')

const router=express.Router()

const{getSubcategorey,saveSubcategorey,getSubcategoreyById,deleteSubcategoreyById,patchSubcategoreyById}=require('../controllers/subcategoreycontroller')

// ===========================================
router.get('/',getSubcategorey)

 router.post('/',saveSubcategorey)

 router.get('/:id',getSubcategoreyById)

 router.delete('/:id',deleteSubcategoreyById)

 router.patch('/:id',patchSubcategoreyById)

module.exports=router