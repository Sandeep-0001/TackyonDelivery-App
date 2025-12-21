export const optimizeRoutes = (orders: any[]) => {
    if (!orders || orders.length === 0) {
        return [];
    }

    // Example DSA: Nearest Neighbor Algorithm for route optimization
    const optimizedRoutes = [];
    const unvisitedOrders = [...orders]; // Create a copy to avoid mutating original array
    
    // Start with the first order
    let currentOrder = unvisitedOrders.shift();
    optimizedRoutes.push(currentOrder);
    
    // Continue until all orders are visited
    while (unvisitedOrders.length > 0) {
        let nearestOrderIndex = -1;
        let minDistance = Infinity;
    
        // Find the nearest unvisited order
        unvisitedOrders.forEach((order, index) => {
            const distance = calculateDistance(currentOrder, order);
            if (distance < minDistance) {
                minDistance = distance;
                nearestOrderIndex = index;
            }
        });
    
        // Move to the nearest order
        if (nearestOrderIndex !== -1) {
            currentOrder = unvisitedOrders.splice(nearestOrderIndex, 1)[0];
            optimizedRoutes.push(currentOrder);
        }
    }
    
    return optimizedRoutes;
};
  
const calculateDistance = (order1: any, order2: any) => {
    // Check if coordinates exist
    if (!order1.latitude || !order1.longitude || !order2.latitude || !order2.longitude) {
        // If coordinates are missing, use a simple hash-based distance
        const address1 = order1.deliveryAddress || '';
        const address2 = order2.deliveryAddress || '';
        return Math.abs(address1.length - address2.length) + Math.abs(address1.charCodeAt(0) - address2.charCodeAt(0));
    }
    
    // Haversine formula for calculating distance between two points on Earth
    const R = 6371; // Earth's radius in kilometers
    const dLat = (order2.latitude - order1.latitude) * Math.PI / 180;
    const dLon = (order2.longitude - order1.longitude) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(order1.latitude * Math.PI / 180) * Math.cos(order2.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
};
  