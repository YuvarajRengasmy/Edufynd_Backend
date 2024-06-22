"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const cors = require("cors");
const database_1 = require("./src/utils/database");
const router_1 = require("./src/router");
exports.app = {
    instance: express(),
    async init() {
        this.initConfig();
        await this.initDatabase();
        this.initRoutes();
    },
    /**
 * Initialize the database connection with MongoDB
 */
    initDatabase() {
        return new database_1.mongoconnect().connectToDb();
    },
    initConfig() {
        this.instance.use(cors());
        this.instance.use(bodyParser.json());
        this.instance.use(bodyParser.urlencoded({ extended: false }));
        this.instance.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authtoken, access_token, Accept, authorization");
            res.header("Access-Control-Allow-Methods", "*");
            if (req.method === 'OPTIONS') {
                res.send(200);
            }
            else {
                next();
            }
        });
    },
    initRoutes() {
        this.instance.use(express.static(path.join(__dirname, 'dist')));
        this.instance.use('/api', router_1.default);
        this.instance.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'dist/index.html'));
        });
        this.instance.use((req, res, next) => {
            const err = new Error('Not Found');
            err['status'] = 404;
            next(err);
        });
        this.instance.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.send({ success: false, message: err.message, result: {}, statusCode: err.status });
        });
    },
};
//# sourceMappingURL=app.js.map