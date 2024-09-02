import { User, UserDocument } from '../model/user.model'
import { validationResult } from 'express-validator'
import { response } from '../../helper/commonResponseHandler'
import { clientError, errorMessage } from '../../helper/ErrorMessage'

var activity = "User"


export const getAllUser = async(req, res, next)=>{
    try {
        const user = await User.find({isDeleted: false})
        response(req, res, activity,  "Level-1", "GetAll-User", true, 200, user, clientError.success.fetchedSuccessfully)
        
    } catch (err: any) {
        response(req, res, activity, "Level-2", 'GetAll-User', false, 500, {},  errorMessage.internalServer, err.message)
        
    }
}



export let createUser = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userDetails:UserDocument = req.body;
            const createUser = new User(userDetails);
            let insertData = await createUser.save();
            response(req, res, activity, 'Level-1', 'Create-User', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


export const assignPrivileges = async (req: any, res: any) => {
    const { userId, privileges } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user privileges
        user.privileges = privileges; // Replace or modify based on your logic
        await user.save();

        res.status(200).json({ message: 'Privileges assigned successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning privileges', error });
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
