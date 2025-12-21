import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/orderModel"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

const seedOrders = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const sampleOrders = [
      { customerName: "Alice", address: "123 Main St", status: "Processing" },
      { customerName: "Bob", address: "456 Oak Ave", status: "Shipped" },
      { customerName: "Charlie", address: "789 Pine Rd", status: "Delivered" },
    ];

    await Order.deleteMany(); // clears old data
    await Order.insertMany(sampleOrders);

    console.log("🌱 Orders seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedOrders();
