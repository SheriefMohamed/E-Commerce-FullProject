const mongoose = require('mongoose');
const connectDatabase = async () => {
    try{
        const con = await mongoose.connect(process.env.ATLAS_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Connected To Mongodb !`);
    }catch (err){
        console.log(err)
    }
}

module.exports = connectDatabase;