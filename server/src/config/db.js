const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGODB, {
            autoIndex: true
        });

        console.log('connected to the db...');
                
    } catch (err) {
        console.log('Database not connected...', err);
        process.exit(1);
    }
};

module.exports = connectDB;