# Getting Started with Create React App

# RouteOptimizer Frontend

A React-based frontend application for the RouteOptimizer system that provides order tracking, route optimization, and search functionality.

## Features

- **Order Tracker**: View and track all orders with their current status
- **Route Optimizer**: Generate optimized delivery routes
- **Search Orders**: Search for orders by customer name or address
- **Dashboard**: Overview of recent orders, statistics, and notifications
- **Responsive Design**: Modern UI with mobile-friendly layout

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend server running on port 3001

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file (already created):
```bash
# .env file contains:
REACT_APP_API_URL=http://localhost:3001
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) to view the application

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── orderTracker.tsx
│   ├── routeOptimizer.tsx
│   ├── searchOrder.tsx
│   ├── RecentOrders.tsx
│   ├── UserStatistics.tsx
│   └── notifications.tsx
├── pages/              # Page components
│   ├── homePage.tsx
│   └── dashboard.tsx
├── services/           # API services
│   └── api.ts
├── styles/             # CSS styles
│   └── styles.css
├── App.tsx             # Main app component
└── index.tsx           # App entry point
```

## API Integration

The frontend communicates with the backend API through the following endpoints:
- `GET /api/orders` - Fetch all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/search` - Search orders
- `GET /api/routes/optimize` - Optimize delivery routes

## Troubleshooting

- **Connection Issues**: Ensure the backend server is running on port 3001
- **API Errors**: Check the browser console for detailed error messages
- **Build Issues**: Clear node_modules and reinstall dependencies

## Technologies Used

- React 18
- TypeScript
- React Router DOM
- Axios
- CSS3 with modern features
