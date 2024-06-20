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
exports.SERVER = exports.ENVIRONMENT = void 0;
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.ENVIRONMENT = process.env.NODE_ENV;
switch (exports.ENVIRONMENT) {
    case 'production': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.production'))) {
            dotenv.config({ path: ".env" });
        }
        else {
            process.exit(1);
        }
        break;
    }
    case 'development': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.development'))) {
            dotenv.config({ path: ".env.development" });
        }
        else {
            process.exit(1);
        }
        break;
    }
    case 'testing': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.testing'))) {
            dotenv.config({ path: ".env.testing" });
        }
        else {
            process.exit(1);
        }
        break;
    }
    default: {
        if (fs.existsSync(path.join(process.cwd(), '/.env.development'))) {
            dotenv.config({ path: ".env.development" });
        }
        else {
            process.exit(1);
        }
    }
}
exports.SERVER = {
    APP_NAME: 'edufynd',
    PORT: process.env['PORT'],
    MONGODB_URL: process.env['MONGODB_URL'] || '',
    CREDENTIALS: process.env['MONGODB_URL'] || '',
    MONGODB_USER: process.env['MONGODB_USER'],
    MONGODB_PASSWORD: process.env['MONGODB_PASSWORD'],
    BASE_URL: process.env['BaseURL'],
    TOKEN_EXPIRATION_IN_MINUTES: 259200000,
    JWT_SECRET_KEY: process.env['jwtSecretKey'],
    COUNTRY_CODE: '+91',
    MAX_DISTANCE_RADIUS_TO_SEARCH: '1',
    THUMB_WIDTH: 300,
    THUMB_HEIGHT: 300,
    EMAIL_HOST: process.env['EMAIL_HOST'],
    EMAIL_PORT: process.env['EMAIL_PORT'],
    EMAIL_USER: process.env['EMAIL_USER'],
    EMAIL_PASS: process.env['EMAIL_PASS'],
    EMAIL_CODE: process.env['EMAIL_CODE'],
    SMS_API_KEY: process.env['API_KEY'],
    SMS_SENDER_ID: process.env['SENDER_ID'],
    SMS_ROUTE_NO: process.env['ROUTE_NO'],
    SMS_CODE: process.env['SMS_CODE'],
    PAYMENT_TYPE: process.env['PAYMENT_TYPE'],
    BASIC_AUTH_USER: process.env['basicAuthUser'],
    BASIC_AUTH_PWD: process.env['basicAuthKey'],
    SENDGRID_API_KEY: process.env['sendGridApiKey'],
    DOMAIN_NAME: process.env['DOMAIN_NAME'],
    ADMIN_DOMAIN: process.env['ADMIN_DOMAIN'],
    SNS_ACCESS_KEY: process.env['SNS_KEY'],
    SNS_SECRET_KEY: process.env['SNS_SECRET'],
    SNS_MSG_ACCESS_KEY: process.env['SNS_MSG_ACCESS_KEY'],
    SNS_MSG_SECRET_KEY: process.env['SNS_MSG_SECRET_KEY'],
    SES_ACCESS_KEY: '',
    SES_SECRET_KEY: '',
    SALT: '',
    CIPER: '',
    AWS_ACCESS_KEY: process.env['AWS_ACCESS_KEY'],
    AWS_SECRET_KEY: process.env['AWS_SECRET_KEY'],
    AWS_REGION: '',
    SNS_REGION: process.env['SNS_REGION'],
    AWS_BUCKET: process.env['S3_BUCKET'],
    S3_URL: process.env['S3_BASE_URL'],
    CRYPTO_ALGO: 'aes-128-ctr',
    CRYPTO_KEY: 'test',
    FCM_KEY: '',
};
