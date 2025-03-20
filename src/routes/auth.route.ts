import express from 'express';
import { verifyUser } from '../middlewares/auth.middleware';
import { generateAccessToken } from '../controllers/auth.controller';


const router = express.Router();

router.get('/generate-token',verifyUser,generateAccessToken)
export default router;