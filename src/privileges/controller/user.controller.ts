import { User, UserDocument } from '../model/user.model'
import { Staff, StaffDocument } from '../../model/staff.model'
import { SuperAdmin, SuperAdminDocument } from '../../model/superAdmin.model'
import { validationResult } from 'express-validator'
import { response } from '../../helper/commonResponseHandler'
import { clientError, errorMessage } from '../../helper/ErrorMessage'
import { decrypt, encrypt, generateRandomPassword } from "../../helper/Encryption";
import * as TokenManager from "../../utils/tokenManager";

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


export const assignPrivilegesss = async (req: any, res: any) => {
    const { userId, privileges } = req.body;

    try {
        // const user = await Staff.findById(userId);
        const user = await SuperAdmin.findById(userId);
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



export let createSuperAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const admin = await User.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });

            if (!admin) {
                req.body.password = await encrypt(req.body.password)
                req.body.confirmPassword = await encrypt(req.body.confirmPassword)

                const adminDetails: UserDocument = req.body;
           
                const createData = new User(adminDetails);
                const userDetails:UserDocument = req.body;
                const createUser = new User(userDetails);
                await createUser.save();
                let insertData = await createData.save();
            
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'superAdmin'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["token"] = token;
                finalResult["loginType"] = 'admin';
                finalResult["adminDetails"] = result;
                response(req, res, activity, 'Level-2', 'Create-Admin', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Create-Admin', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
console.log(err)
            response(req, res, activity, 'Level-3', 'Create-Admin', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Create-Admin', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



// Assign Permissions (Only accessible by SuperAdmin)
export const assignPermissions = async (req, res) => {
    try {
        const { userId, module, permissions } = req.body; // Extract user ID, module, and permissions from request body
        const user = await SuperAdmin.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'superAdmin') {
            return res.status(403).json({ message: 'SuperAdmin cannot have modified permissions' });
        }

        // Find or create the privilege entry for the specified module
        let privilege = user.privileges.find((p) => p.module === module);
        if (privilege) {
            privilege.add = permissions.add ?? privilege.add;
            privilege.edit = permissions.edit ?? privilege.edit;
            privilege.view = permissions.view ?? privilege.view;
            privilege.delete = permissions.delete ?? privilege.delete;
        } else {
            user.privileges.push({
                module,
                ...permissions, // Spread permissions object to handle add, edit, view, and delete
            });
        }

        await user.save();
        res.status(200).json({ message: 'Permissions assigned successfully' });
    } catch (error) {
        console.error('Error assigning permissions:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
