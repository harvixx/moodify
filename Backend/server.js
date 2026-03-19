require("dotenv").config();
const connectToDb = require("./src/config/database");
const app = require("./src/app")
port = 3000;
(async () => {
    try {
        await connectToDb();
        app.listen(process.env.PORT || port,()=>{
            console.log("Server is running");
        })
    } catch (error) {
        console.error("Server not connected");
        process.exit(1);
    }
})();