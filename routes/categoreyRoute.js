const express=require('express')

const router=express.Router()

const{getCategorey,saveCategorey,getCategoreyById,deleteCategoreyById,patchCategoreyById}=require('../controllers/categoreycontroller')

// ===========================================
router.get('/',getCategorey)

 router.post('/',saveCategorey)

 router.get('/:id',getCategoreyById)

 router.delete('/:id',deleteCategoreyById)

 router.patch('/:id',patchCategoreyById)

module.exports=router
