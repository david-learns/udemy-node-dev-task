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



// example file upload
// const multer = require('multer');
// const upload = multer({
//     dest: './images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.jpg$|\.jpeg$|\.png$/)) {
//             cb(new Error('pdf, jpg, jpeg, or png of 1MB or less shall pass'));
//         }
//         cb(null, true);
//     }
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// });