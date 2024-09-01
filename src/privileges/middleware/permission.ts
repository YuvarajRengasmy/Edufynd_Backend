import {User} from '../../model/user.model'
import { Role, RoleDocument } from '../../privileges/model/role.model';

import { Request, Response, NextFunction } from 'express';


export const checkPermission = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, module, permissionType } = req.body;

    try {
        const user = await User.findById(userId).populate('role').exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure TypeScript knows that role is a RoleDocument
        const role = user.role as unknown as RoleDocument;

        // Now TypeScript should understand that role has a 'privileges' property
        const modulePrivileges = role.privileges.find((p) => p.module === module);
        if (!modulePrivileges || !modulePrivileges.permissions[permissionType]) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
