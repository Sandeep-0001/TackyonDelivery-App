import express from 'express';
import { getOrders, createOrder, searchOrdersController, deleteOrder, updateOrder } from '../controllers/orderController';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/search', searchOrdersController);
router.delete('/:id', deleteOrder);
router.put('/:id', updateOrder);

export default router;
