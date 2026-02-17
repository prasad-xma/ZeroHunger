require('dotenv').config();

const connectDB = require('./config/db');
const cors = require('cors');

const express = require('express');
const app = express();


app.use(cors());
app.use(express.json());


/***************************** ROUTES ***********************/









// port
const PORT = process.env.PORT || 5000;

// establish the db connection and start the server
(async () => {

    try {
        // establish the db connection
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (err) {
        console.log('fail to connect db...', err);
        process.exit(1);
    }
})();
