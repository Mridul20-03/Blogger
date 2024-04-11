import express from 'express';

const app = express();


//listen to a port
app.listen(3000, () => {
    console.log('Server runs on port 3000!!');
});