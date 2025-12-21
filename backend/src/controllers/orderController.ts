import { Request, Response } from 'express';
import Order from '../models/orderModel';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchOrdersController = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    // Ensure query is a string and not empty
    const searchQuery = Array.isArray(query) ? query[0] : query;
    if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search using MongoDB
    const mongoResults = await Order.find({
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
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error during order update' });
  }
};