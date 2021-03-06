require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


const server = app.listen(port, () => {
    console.log('server is running: ', server.address().address.concat(':', server.address().port));
});

