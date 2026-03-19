const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose");
async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database is connected");
    } catch (error) {
        console.error("Unable to connect to database ", error);
        throw error;
    }
}

module.exports = connectToDb;