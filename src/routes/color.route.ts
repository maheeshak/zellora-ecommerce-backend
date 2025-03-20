import express from 'express';
import { findAll } from '../controllers/color.controller';



const router = express.Router();

router.get('/', findAll);
export default router;