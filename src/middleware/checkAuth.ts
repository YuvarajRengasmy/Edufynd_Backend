import * as auth from 'basic-auth';
import { clientError } from '../helper/ErrorMessage';
import { SuperAdmin } from "../model/superAdmin.model";
import { Admin } from "../model/admin.model";
import { Student } from "../model/student.model";
import { Agent } from "../model/agent.model";
import { Staff } from '../model/staff.model'

/**
 * @author Balan K K
 * @date  01-05-2024
 * @description Authentication Methods
 */


export let basicAuthUser = function (req, res, next) {
    // console.log("basicauth verifying...")
   
    var credentials = auth(req);
    // console.log('credential',credentials);
    if (!credentials || credentials.name != process.env.basicAuthUser || credentials.pass != process.env.basicAuthKey) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"')
        return res.status(401).json({
            success: false,
            statusCode: 499,
            message: clientError.token.unauthRoute,
        });
    } else {
        next();
    }
}



export const validateUser = async (req, res, next) => {
    try {
        const userId = req.body._id || req.query._id || req.headers['_id'];
        const loginType = req.body.loginType || req.query.loginType || req.headers['logintype'];

        let user = null;

        if (userId && loginType) {
            if (loginType === 'superadmin') {
                user = await SuperAdmin.findById(userId);
            } else if (loginType === 'admin') {
                user = await Admin.findById(userId);
            } else if (loginType === 'student') {
                user = await Student.findById(userId);
            } else if (loginType === 'agent') {
                user = await Agent.findById(userId);
            } else if (loginType === 'staff') {
                user = await Staff.findById(userId);
            }
        } else {
            return res.status(400).json({ success: false, message: 'User ID and login type are required' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Attach user to request object
        req.currentUser = user;

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating user', error });
    }
};
export const validateAgentId = async (req, res, next) => {
    try {
        const agentId = req.body._id || req.query._id || req.headers['agent-id'];

        // Check if agent ID is provided
        if (!agentId) {
            return res.status(400).json({ success: false, message: 'Agent ID is required' });
        }

        // Validate agent ID
        const agent = await Agent.findById(agentId);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Attach agent to request object
        req.agent = agent;
   
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating agent ID', error });
    }
};



