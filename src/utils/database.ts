"use strict";
import * as mongoose from 'mongoose';
import * as config from '../config';


export class mongoconnect {
    connectToDb(): any {
        try {
            mongoose.set("debug", true);
            mongoose.set('strictQuery', true);
            mongoose.connect(config.SERVER.MONGODB_URL);
           
            console.info("Connect to Database");
            var db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error:"));
            
        } catch (err) {
            console.error("Connection error" + err);
        }
    }
}