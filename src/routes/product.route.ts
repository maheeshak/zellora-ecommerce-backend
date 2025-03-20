import express from 'express';
import { findAll, findById, findBySlug } from '../controllers/web/product.controller';



const router = express.Router();

router.get('/:id',findById)
router.get('/slug/:slug',findBySlug)
router.get('/',findAll)

export default router;