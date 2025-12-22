"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const orderModel_1 = __importDefault(require("../models/orderModel")); // adjust path if needed
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
const seedOrders = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");
        const sampleOrders = [
            { customerName: "Alice", address: "123 Main St", status: "Processing" },
            { customerName: "Bob", address: "456 Oak Ave", status: "Shipped" },
            { customerName: "Charlie", address: "789 Pine Rd", status: "Delivered" },
        ];
        await orderModel_1.default.deleteMany(); // clears old data
        await orderModel_1.default.insertMany(sampleOrders);
        console.log("🌱 Orders seeded successfully!");
        process.exit();
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};
seedOrders();
