import express from 'express';
import { getOptimizedRoutes, createSampleOrders } from '../controllers/routeController';

const router = express.Router();

router.get('/optimize', getOptimizedRoutes);
router.post('/sample-orders', createSampleOrders);

export default router;
