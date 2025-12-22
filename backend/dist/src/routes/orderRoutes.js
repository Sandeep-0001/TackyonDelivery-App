"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.get('/', orderController_1.getOrders);
router.post('/', orderController_1.createOrder);
router.get('/search', orderController_1.searchOrdersController);
router.delete('/:id', orderController_1.deleteOrder);
router.put('/:id', orderController_1.updateOrder);
exports.default = router;
