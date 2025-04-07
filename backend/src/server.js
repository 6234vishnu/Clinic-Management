import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import session from "express-session";
import doctorRoute from './routes/doctorRoutes.js';
import receptionistRoute from './routes/receptionistRoute.js';
import connectDB from './config/db.js';



dotenv.config();
connectDB()

const app = express();
const  PORT = process.env.PORT;
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Authorization",
    })
);


app.use(express.json());

app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

app.use('/doctor', doctorRoute);
app.use('/receptionist', receptionistRoute);

app.get('/', (req, res) => {
    res.send('backend is running');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
