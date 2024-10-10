import * as jwt from 'jsonwebtoken';
import { response } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
import * as config from '../config';
import { Admin } from "../model/admin.model";
import { Student } from "../model/student.model";
import { Agent } from "../model/agent.model";
import { Staff } from '../model/staff.model'
import { SuperAdmin } from "../model/superAdmin.model";
const activity = 'token';

/**
 * @author Balan K K
 * @date 01-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to token creation
 */


export let CreateJWTToken = (data: any = {}) => {
    let tokenData = {};
    if (data && data['name']) {
        tokenData['name'] = data['name']
    }
    if (data && data['loginType']) {
        tokenData['loginType'] = data['loginType']
    }
    if (data && data['id']) {
        tokenData['id'] = data['id']
    }

    const token = jwt.sign(tokenData, 'edufynd', { expiresIn: '24h' });
    return token;
}



/**
 * @author Balan K K
 * @date 07-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Chech the session and Verify the token
 */




export let checkSession = async (req, res, next) => {
    // console.log("Entering checkSession middleware");

    let authHeader = req.headers['token'];
    if (authHeader) {
        const parts = authHeader.split(' ');
        const headerType = parts[0];
        const tokenValue = parts[1]?.trim();

        if (headerType === "Bearer" && tokenValue) {
            try {
                const tokendata = await jwt.verify(tokenValue, 'edufynd');
                // console.log('Token data:', tokendata);

                req.body.loginId = tokendata.userId;
                req.body.loginId = tokendata.id;
                req.body.loginUserName = tokendata.userName
                req.body.createdBy = tokendata.loginType;
                req.body.createdOn = new Date();
                req.body.modifiedBy = tokendata.loginType;
                // req.body.modifiedOn = new Date();
                next();
            } catch (err) {
                console.error("JWT Verification Error:", err);
                return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute, err.message);
            }
        } else if (headerType === "Basic" && tokenValue) {
            const credentials = Buffer.from(tokenValue, 'base64').toString('utf-8').split(':');
            const username = credentials[0];
            const password = credentials[1];
            console.log("Basic Auth - Username:", username);
            console.log("Basic Auth - Password:", password);

            // Validate the username and password as per your logic here
            if (username === config.SERVER.BASIC_AUTH_USER && password === config.SERVER.BASIC_AUTH_PWD) {

                next();
            } else {
                console.error("Invalid Basic Auth credentials");
                return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute);
            }
        } else {
            console.error("Invalid token format or missing token");
            return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.sessionExpire);
        }
    } else {
        console.error("Authorization header not found");
        return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute);
    }
};




// export const checkPermissionn = (module: string, action: keyof typeof actions) => {
//     return async (req, res, next) => {
//         const authHeader = req.headers['token'];

//         if (authHeader) {
//             const [headerType, tokenValue] = authHeader.split(' ');

//             if (headerType === "Bearer" && tokenValue?.trim()) {
//                 try {
//                     const tokendata = await jwt.verify(tokenValue.trim(), 'edufynd');
//                     console.log('Token data to check permission:', tokendata);

//                     // Find the user from any of the models
//                     const user = await SuperAdmin.findOne({ _id: tokendata.id }) ||
//                         await Student.findOne({ _id: tokendata.id }) ||
//                         await Admin.findOne({ _id: tokendata.id }) ||
//                         await Agent.findOne({ _id: tokendata.id }) ||
//                         await Staff.findOne({ _id: tokendata.id });

//                     // console.log("User found:", user);

//                     if (!user) {
//                         return res.status(404).json({ message: 'User not found' });
//                     }

//                     // If the user is a SuperAdmin, directly call next()
//                     if (user.role === "superAdmin") {
//                         return next();
//                     }

//                     // For non-SuperAdmin users, check privileges
//                     const privilege = user.privileges.find((p) => p.module === module);
//                     console.log(`Checking ${action} permission for module ${module}:`, privilege);

//                     if (!privilege) {
//                         return res.status(403).json({ message: `Access denied: No privileges found for module ${module}` });
//                     }

//                     // Check if the specific action (add/edit/view/delete) is allowed
//                     if (!privilege[actions[action]]) {
//                         console.log(`Permission check failed: ${action} is not allowed for module ${module}`);
//                         return res.status(403).json({ message: `Access denied: You do not have permission to ${action} this ${module}` });
//                     }

//                     next();
//                 } catch (error) {
//                     console.error('Error checking permissions:', error);
//                     return res.status(500).json({ message: 'Internal server error', error });
//                 }
//             } else {
//                 return res.status(401).json({ message: 'Invalid or missing authorization header' });
//             }
//         } else {
//             return res.status(401).json({ message: 'Authorization header not provided' });
//         }
//     };
// };


// Default privilege settings for University and Program
const getDefaultPrivilege = (module) => {
    // Default to view: true for University and Program
    if (module === 'university' || module === 'program') {
        return { add: false, edit: false, view: true, delete: false };
    }
    // Default to all false for other modules
    return { add: false, edit: false, view: false, delete: false };
};


export const checkPermission = (module: string, action: keyof typeof actions) => {
    return async (req, res, next) => {
        const authHeader = req.headers['token'];

        if (authHeader) {
            const [headerType, tokenValue] = authHeader.split(' ');

            if (headerType === "Bearer" && tokenValue?.trim()) {
                try {
                    const tokendata = await jwt.verify(tokenValue.trim(), 'edufynd');
                    console.log('Token data to check permission:', tokendata);

                    // Find the user from any of the models
                    const user = await SuperAdmin.findOne({ _id: tokendata.id }) ||
                        await Student.findOne({ _id: tokendata.id }) ||
                        await Admin.findOne({ _id: tokendata.id }) ||
                        await Agent.findOne({ _id: tokendata.id }) ||
                        await Staff.findOne({ _id: tokendata.id });

                    // console.log("User found:", user);

                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }

                    // If the user is a SuperAdmin, directly call next()
                    if (user.role === "superAdmin") {
                        return next();
                    }

                    // For non-SuperAdmin users, check privileges
                    const privilege = user.privileges.find((p) => p.module === module);
                    console.log(`Checking ${action} permission for module ${module}:`, privilege);

                    // If no privilege is found, use default privilege
                    const effectivePrivilege = privilege || getDefaultPrivilege(module);

                    if (!effectivePrivilege) {
                        return res.status(403).json({ message: `Access denied: No privileges found for module ${module}` });
                    }

                    // Check if the specific action (add/edit/view/delete) is allowed
                    if (!effectivePrivilege[actions[action]]) {
                        console.log(`Permission check failed: ${action} is not allowed for module ${module}`);
                        return res.status(403).json({ message: `Access denied: You do not have permission to ${action} this ${module}` });
                    }

                    next();
                } catch (error) {
                    console.error('Error checking permissions:', error);
                    return res.status(500).json({ message: 'Internal server error', error });
                }
            } else {
                return res.status(401).json({ message: 'Invalid or missing authorization header' });
            }
        } else {
            return res.status(401).json({ message: 'Authorization header not provided' });
        }
    };
};



const actions = {
    add: 'add',
    edit: 'edit',
    view: 'view',
    delete: 'delete',
};





export const assignPermissions = async (req, res) => {
    try {
        const { userId, privileges } = req.body; // Expect privileges as an array
        const user = await SuperAdmin.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        privileges.forEach((priv: any) => {
            let privilege = user.privileges.find((p) => p.module === priv.module);

            if (privilege) {
                // Update existing privilege
                privilege.add = priv.add ?? privilege.add;
                privilege.edit = priv.edit ?? privilege.edit;
                privilege.view = priv.view ?? privilege.view;
                privilege.delete = priv.delete ?? privilege.delete;
            } else {
                // Add new privilege
                user.privileges.push({
                    module: priv.module,
                    add: priv.add,
                    edit: priv.edit,
                    view: priv.view,
                    delete: priv.delete,
                });
            }
        });

        await user.save();
        res.status(200).json({ message: 'Permissions assigned successfully' });
    } catch (error) {
        console.error('Error assigning permissions:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


















// export let checkSession = async (req, res, next) => {
//     const token = req.headers['token'];
//     if (token) {
//         const headerType = token.split(' ')[0];
//         const tokenValue = token.split(' ')[1].trim();
//         if (headerType.trim() === "Bearer") {
//             try {
//                 jwt.verify(tokenValue, 'edufynd', function (err, tokendata) {
//                     if (err) {
//                         return res.status(401).json({ message: clientError.token.sessionExpire })
//                     }
//                     if (tokendata) {
//                         console.log('tokendata',tokendata);
//                         req.body.loginId = tokendata.id;
//                         req.body.loginUserName = tokendata.name;
//                         req.body.loginType = tokendata.loginType;
//                         req.body.createdBy = tokendata.name;
//                         req.body.createdOn = new Date();
//                         req.body.modifiedBy = tokendata.name;
//                         req.body.modifiedOn = new Date();
//                         next();
//                     }
//                 });
//             } catch (err: any) {
//                 return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute, err.message);
//             }
//         }
//     } else {
//         return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute);
//     }
// }



