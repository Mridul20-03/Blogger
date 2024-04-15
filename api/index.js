import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();

mongoose.connect(process.env.MONGO_URL).then((res) => {
    console.log('Mongo Db connected');
}).catch((err) => { console.log(err); });

const app = express();

app.use(express.json());
app.use(cookieParser());


//listen to a port
app.listen(3000, () => {
    console.log('Server runs on port 3000!!');
});

//Routing
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);


//Error Handling Middleware
app.use((err , req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});