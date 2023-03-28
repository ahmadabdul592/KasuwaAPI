const mongoose = require('mongoose');


const connectDB = (url) => {
     mongoose.connect(process.env.MONGODB_URL)

     mongoose.connection.on("connected", ()=> {
        console.log("connected to MongoDB Successfully")
     });

     mongoose.connection.on("error", (err) =>{
        console.log("An error occured, connection not Sucessful")
        console.log(err);
     });
};

module.exports = connectDB;
