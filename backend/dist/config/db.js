"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shreeraj_traders';
    try {
        await mongoose_1.default.connect(uri);
        console.log(`[Database] MongoDB Connected to ${uri}`);
    }
    catch (error) {
        console.warn(`[Database] MongoDB connection failed or running in in-memory/mock fallback mode:`, error);
    }
}
