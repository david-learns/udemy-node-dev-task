

require('dotenv').config();
const mongoose = require('mongoose');

const connectionURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_URL}/${process.env.DB_GOOSE}?retryWrites=true&w=majority`

mongoose.connect(connectionURL)





// const newDoc = new User({
//     name: 'Man Queefer',
//     age: 32,
//     email: 'maniqueefer@queefleaf.com',
//     password: 'themanqueefer'
// })



// const query = { description: 'brush teeth' }
// Task.findOneAndUpdate(query, { $set: { completed: true }}, { new: true }, (err, res) => {
//     if (err) console.log(err.message)
//     console.log(res)
//     mongoose.disconnect()
//         .then(() => {
//             console.log('mongoose db connections closed');
//         })
//         .catch(function (error) {
//             console.log(error);
//         })
// })

// const newDoc = new Task({
//     description: '      wash ass    ',
// })

// newDoc.save()
//     .then((res) => {
//         console.log(res)
//     })
//     .catch((err) => {
//         console.log(err.message);
//     })
//     .finally(() => {
//         mongoose.disconnect()
//             .then(() => {
//                 console.log('mongoose db connections closed');
//             })
//             .catch(function (error) {
//                 console.log(error);
//             })
//     })


