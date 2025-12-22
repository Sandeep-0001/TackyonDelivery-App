"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.deleteOrder = exports.searchOrdersController = exports.createOrder = exports.getOrders = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const getOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.default.find();
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getOrders = getOrders;
const createOrder = async (req, res) => {
    try {
        const newOrder = new orderModel_1.default(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createOrder = createOrder;
const searchOrdersController = async (req, res) => {
    try {
        const { query } = req.query;
        // Ensure query is a string and not empty
        const searchQuery = Array.isArray(query) ? query[0] : query;
        if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        // Search using MongoDB
        const mongoResults = await orderModel_1.default.find({
            $or: [
                { customerName: { $regex: searchQuery, $options: 'i' } },
                { deliveryAddress: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        // Transform MongoDB results to match the expected format
        const results = mongoResults.map(order => ({
            _id: order._id,
            _source: {
                customerName: order.customerName,
                deliveryAddress: order.deliveryAddress,
                latitude: order.latitude,
                longitude: order.longitude,
                status: order.status
            }
        }));
        res.json(results);
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error during search' });
    }
};
exports.searchOrdersController = searchOrdersController;
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await orderModel_1.default.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully', order: deletedOrder });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteOrder = deleteOrder;
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await orderModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    }
    catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error during order update' });
    }
};
exports.updateOrder = updateOrder;
