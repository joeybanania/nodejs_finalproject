const mongoose = require('mongoose');
const connect = async () => {
    await mongoose
        .connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }).then((conn) => {
            console.log(`MongoDB connected to: ${conn.connection.host}`);
        }).catch((err) => {
            console.error('Something went wrong', err);
        });
};

module.exports = connect;