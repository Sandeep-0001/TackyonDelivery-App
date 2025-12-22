"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./src/config/passport"));
const orderRoutes_1 = __importDefault(require("./src/routes/orderRoutes"));
const routesRoutes_1 = __importDefault(require("./src/routes/routesRoutes"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const app = (0, express_1.default)();
// Enable CORS for all routes
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Session configuration for passport
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/routes', routesRoutes_1.default);
exports.default = app;
