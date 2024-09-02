import { User } from '../model/user.model';
import { Request, Response, NextFunction } from 'express';




export const checkPermission = async (req: any, res: any, next: any) => {
    const { userId, module, permissionType } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const modulePrivileges = user.privileges.find(p => p.module === module);
        if (!modulePrivileges || !modulePrivileges.permissions[permissionType]) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

