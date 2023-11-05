require('dotenv').config();
const mongoose = require('mongoose');
const DB = process.env.DATABASE;

exports.connectMongoose = async() => {
    try {
        await mongoose.connect(DB);
        console.log('Database Connected Successfully')
    } catch (error) {
       console.log(error); 
    }
};