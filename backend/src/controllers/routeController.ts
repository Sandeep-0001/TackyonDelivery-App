import { Request, Response } from 'express';
import Order from '../models/orderModel';
import { optimizeRoutes } from '../services/routeService';

export const getOptimizedRoutes = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    const optimizedRoutes = optimizeRoutes(orders);
    
    // Transform the data to match frontend expectations
    const formattedRoutes = optimizedRoutes.map((order: any) => ({
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
  } catch (error) {
    console.error('Error optimizing routes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while optimizing routes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createSampleOrders = async (req: Request, res: Response) => {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    
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
    
    const createdOrders = await Order.insertMany(sampleOrders);
    
    res.json({
      success: true,
      message: `Created ${createdOrders.length} sample orders for testing`,
      orders: createdOrders
    });
  } catch (error) {
    console.error('Error creating sample orders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating sample orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
