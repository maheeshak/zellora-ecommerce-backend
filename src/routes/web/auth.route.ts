import express from 'express';
import { signin, signup, test } from '../../controllers/web/auth.controller';
import { verifyUser } from '../../middlewares/auth.middleware';



const router = express.Router();


router.post('/signup',signup)
router.post('/signin',signin)
router.get('/test',verifyUser,test)


export default router;