import express from 'express';
import { verifyUser } from '../../middlewares/auth.middleware';
import { changeDeliveryStatus, changePaymentStatus, create, findByUserId } from '../../controllers/web/order.controller';



const router = express.Router();

router.post('/', verifyUser, create)
router.get('/my/', verifyUser, findByUserId)
router.put('/change-payment-status/:orderId', verifyUser, changePaymentStatus)
router.put('/change-delivery-status/:orderId', verifyUser, changeDeliveryStatus)


export default router;