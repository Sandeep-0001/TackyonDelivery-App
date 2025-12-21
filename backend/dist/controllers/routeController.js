"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSampleOrders = exports.getOptimizedRoutes = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const routeService_1 = require("../services/routeService");
const getOptimizedRoutes = async (req, res) => {
    try {
        const orders = await orderModel_1.default.find();
        const optimizedRoutes = (0, routeService_1.optimizeRoutes)(orders);
        // Transform the data to match frontend expectations
        const formattedRoutes = optimizedRoutes.map((order) => ({
            customerName: order.customerName,
            deliveryAddress: order.deliveryAddress,
            latitude: order.latitude,
            longitude: order.longitude,
            status: order.status
        }));
        res.json({
            success: true,
            data: formattedRoutes,
            totalOrders: formattedRoutes.length,
            message: `Optimized route for ${formattedRoutes.length} orders`
        });
    }
    catch (error) {
        console.error('Error optimizing routes:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while optimizing routes',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getOptimizedRoutes = getOptimizedRoutes;
const createSampleOrders = async (req, res) => {
    try {
        // Clear existing orders
        await orderModel_1.default.deleteMany({});
        // Create sample orders with realistic coordinates
        const sampleOrders = [
            {
                customerName: 'John Smith',
                deliveryAddress: '123 Main St, New York, NY',
                latitude: 40.7128,
                longitude: -74.0060,
                status: 'pending'
            },
            {
                customerName: 'Sarah Johnson',
                deliveryAddress: '456 Broadway, New York, NY',
                latitude: 40.7589,
                longitude: -73.9851,
                status: 'pending'
            },
            {
                customerName: 'Mike Davis',
                deliveryAddress: '789 5th Ave, New York, NY',
                latitude: 40.7505,
                longitude: -73.9934,
                status: 'pending'
            },
            {
                customerName: 'Emily Wilson',
                deliveryAddress: '321 Park Ave, New York, NY',
                latitude: 40.7489,
                longitude: -73.9857,
                status: 'pending'
            },
            {
                customerName: 'David Brown',
                deliveryAddress: '654 Lexington Ave, New York, NY',
                latitude: 40.7505,
                longitude: -73.9934,
                status: 'pending'
            }
        ];
        const createdOrders = await orderModel_1.default.insertMany(sampleOrders);
        res.json({
            success: true,
            message: `Created ${createdOrders.length} sample orders for testing`,
            orders: createdOrders
        });
    }
    catch (error) {
        console.error('Error creating sample orders:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating sample orders',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createSampleOrders = createSampleOrders;
