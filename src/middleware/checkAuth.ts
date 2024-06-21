import * as auth from 'basic-auth';
import { clientError } from '../helper/ErrorMessage';
import { Agent, AgentDocument } from '../model/agent.model'




/**
 * @author Balan K K
 * @date  01-05-2024
 * @description Authentication Methods
 */


export let basicAuthUser = function (req, res, next) {
    console.log("basicauth verify")
    var credentials = auth(req);
   
    console.log('credentials',credentials);
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


// export const validateSuperAdminId = async (req, res, next) => {
//     try {
//         const superadminId = req.body._id || req.query._id || req.headers['superAdmin-id'];

//         // Check if agent ID is provided
//         if (!superadminId) {
//             return res.status(400).json({ success: false, message: 'Super Admin ID is required' });
//         }

//         // Validate agent ID
//         const superadmin = await SuperAdmin.findById(superadminId);
//         if (!superadmin) {
//             return res.status(404).json({ message: 'Super Admin not found' });
//         }

//         // Attach agent to request object
//         req.superadmin = superadmin;
   
//         next();
//     } catch (error) {
//         res.status(500).json({ message: 'Error validating agent ID', error });
//     }
// };



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


