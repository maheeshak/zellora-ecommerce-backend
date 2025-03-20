import express from 'express';
import { create, findById,update,findAll, changeStatus } from '../../controllers/admin/product.controller';
import { verifyUser } from '../../middlewares/auth.middleware';
import { verifyRole } from '../../middlewares/role.middleware';
import { Roles } from '../../common/enums/enums';


const router = express.Router();


router.post('/',verifyUser,verifyRole([Roles.ADMIN]),create)
router.get('/:id',verifyUser,verifyRole([Roles.ADMIN]),findById)
router.put('/:id',verifyUser,verifyRole([Roles.ADMIN]),update)
router.get('/',verifyUser,verifyRole([Roles.ADMIN]),findAll)
router.patch('/:id',verifyUser,verifyRole([Roles.ADMIN]),changeStatus)

export default router;