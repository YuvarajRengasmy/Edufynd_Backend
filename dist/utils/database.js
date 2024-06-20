"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoconnect = void 0;
const mongoose = __importStar(require("mongoose"));
const config = __importStar(require("../config"));
// import { User } from '../model/user.model';
class mongoconnect {
    connectToDb() {
        try {
            mongoose.set("debug", true);
            mongoose.set('strictQuery', true);
            mongoose.connect(config.SERVER.MONGODB_URL);
            console.info("Connect to Database");
            var db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error:"));
            // db.once("open", function () {
            //     var fs = require("fs"),
            //     obj;
            //     fs.readFile("./src/upload/user.json", handleFileUser);
            //     async function handleFileUser(err, data) {
            //         if (err) throw err
            //         obj = JSON.parse(data)
            //         const count = await User.find().countDocuments()
            //         if (count === 0) {
            //             User.collection.insertMany(obj).then(function () {
            //                 console.log("Multiple documents inserted to Collection");
            //             }).catch(function (err) {
            //                 console.log(err);
            //             });
            //         }
            //     }
            // });
        }
        catch (err) {
            console.error("Connection error" + err);
        }
    }
}
exports.mongoconnect = mongoconnect;
