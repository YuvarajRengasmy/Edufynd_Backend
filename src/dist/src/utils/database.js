"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoconnect = void 0;
const mongoose = require("mongoose");
const config = require("../config");
class mongoconnect {
    connectToDb() {
        try {
            mongoose.set("debug", true);
            mongoose.set('strictQuery', true);
            mongoose.connect(config.SERVER.MONGODB_URL);
            console.info("Connect to Database");
            var db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error:"));
        }
        catch (err) {
            console.error("Connection error" + err);
        }
    }
}
exports.mongoconnect = mongoconnect;
//# sourceMappingURL=database.js.map