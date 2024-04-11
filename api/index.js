import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then((res) => {
    console.log('Mongo Db connected');
}).catch((err) => { console.log(err); });

const app = express();


//listen to a port
app.listen(3000, () => {
    console.log('Server runs on port 3000!!');
});