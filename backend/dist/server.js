"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_js_1 = require("./config/db.js");
const api_js_1 = __importDefault(require("./routes/api.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Same-origin / curl / server-to-server requests send no Origin header.
        if (!origin || allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check — also reports which database we are actually attached to, so a
// cross-project misconfiguration is visible without reading the code.
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Firmitas Admin & CMS Backend',
        database: mongoose_1.default.connection.name || null,
        dbState: mongoose_1.default.STATES[mongoose_1.default.connection.readyState],
        time: new Date()
    });
});
// API Routes
app.use('/api', api_js_1.default);
// Connect DB & Launch. If the database is unreachable or points at the wrong
// project, refuse to start rather than serving empty responses.
(0, db_js_1.connectDB)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 [Firmitas Backend API] running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ [Firmitas Backend API] failed to start:', err.message);
    process.exit(1);
});
