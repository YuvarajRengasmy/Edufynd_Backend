"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAgentId = exports.basicAuthUser = void 0;
const basic_auth_1 = __importDefault(require("basic-auth"));
const ErrorMessage_1 = require("../helper/ErrorMessage");
const agent_model_1 = require("../model/agent.model");
/**
 * @author Balan K K
 * @date  01-05-2024
 * @description Authentication Methods
 */
let basicAuthUser = function (req, res, next) {
    console.log("basicauth verify");
    var credentials = (0, basic_auth_1.default)(req);
    console.log('credentials', credentials);
    if (!credentials || credentials.name != process.env.basicAuthUser || credentials.pass != process.env.basicAuthKey) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).json({
            success: false,
            statusCode: 499,
            message: ErrorMessage_1.clientError.token.unauthRoute,
        });
    }
    else {
        next();
    }
};
exports.basicAuthUser = basicAuthUser;
const validateAgentId = async (req, res, next) => {
    try {
        const agentId = req.body._id || req.query._id || req.headers['agent-id'];
        // Check if agent ID is provided
        if (!agentId) {
            return res.status(400).json({ success: false, message: 'Agent ID is required' });
        }
        // Validate agent ID
        const agent = await agent_model_1.Agent.findById(agentId);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        // Attach agent to request object
        req.agent = agent;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Error validating agent ID', error });
    }
};
exports.validateAgentId = validateAgentId;
