"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routeController_1 = require("../controllers/routeController");
const router = express_1.default.Router();
router.get('/optimize', routeController_1.getOptimizedRoutes);
router.post('/sample-orders', routeController_1.createSampleOrders);
exports.default = router;
