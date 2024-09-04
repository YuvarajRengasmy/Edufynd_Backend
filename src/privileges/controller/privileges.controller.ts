import { Privilege, PrivilegesDocument } from '../model/privileges.model'
import { validationResult } from 'express-validator'
import { response } from '../../helper/commonResponseHandler'
import { clientError, errorMessage } from '../../helper/ErrorMessage'

var activity = "Privileges"






export let createUser = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userDetails:PrivilegesDocument = req.body;

            const permission = [
                {
                modelName: "University",
                permissions: {
                    add:false,
                    edit: false,
                    view: false,
                    delete: false, 
                    approve:false,
                }
            },
            {
                modelName: "Program",
                permissions: {
                    add: { type: Boolean, default: false },
                    edit: { type: Boolean, default: false },
                    view: { type: Boolean, default: false },
                    delete: { type: Boolean, default: false }, 
                    approve: { type: Boolean, default: false }, 
                }
            },
            {
                modelName: "Client",
                permissions: {
                    add: { type: Boolean, default: false },
                    edit: { type: Boolean, default: false },
                    view: { type: Boolean, default: false },
                    delete: { type: Boolean, default: false }, 
                    approve: { type: Boolean, default: false },
                }
            },
            {
                modelName: "Student",
                permissions: {
                    add: { type: Boolean, default: false },
                    edit: { type: Boolean, default: false },
                    view: { type: Boolean, default: false },
                    delete: { type: Boolean, default: false }, 
                    approve: { type: Boolean, default: false }, 
                }
            }
        ]
            const createUser = new Privilege(userDetails);
            let insertData = await createUser.save();
            response(req, res, activity, 'Level-1', 'Create-User', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};





// async function seedRoles() {
//     const superAdminRole = new Role({
//         roleName: 'SuperAdmin',
//         privileges: [
//             { module: 'Admin', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
//             { module: 'Agent', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
//             { module: 'Application', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
//             { module: 'Client', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
//             { module: 'Commission', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
//             { module: 'Program', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
//             { module: 'Staff', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
//             { module: 'Student', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
//             { module: 'University', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
        
           
//         ],
//     });

//     const adminRole = new Role({
//         roleName: 'Admin',
//         privileges: [
//             { module: 'Admin', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
//             { module: 'Agent', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
//             { module: 'Application', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
//             { module: 'Client', permissions: { add: false, edit: true, view: true, delete: false, approve: true } },
//             { module: 'Commission', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
//             { module: 'Program', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
//             { module: 'Staff', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
//             { module: 'Student', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
//             { module: 'University', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
//         ],
//     });

// await superAdminRole.save()
//     await adminRole.save();
//     console.log('Roles seeded successfully');
// }

// seedRoles().catch(console.error);
