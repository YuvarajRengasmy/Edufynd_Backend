import {Role} from '../model/role.model'

async function seedRoles() {
    const superAdminRole = new Role({
        roleName: 'Super Admin',
        privileges: [
            { module: 'Admin', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
            { module: 'Agent', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
            { module: 'Application', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
            { module: 'Client', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
            { module: 'Commission', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
            { module: 'Program', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
            { module: 'Staff', permissions: { add: true, edit: true, view: true, delete: true, approve: false } },
            { module: 'Student', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
            { module: 'University', permissions: { add: true, edit: true, view: true, delete: true, approve: true } },
        
           
        ],
    });

    const adminRole = new Role({
        roleName: 'Admin',
        privileges: [
            { module: 'Admin', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
            { module: 'Agent', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
            { module: 'Application', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
            { module: 'Client', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
            { module: 'Commission', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
            { module: 'Program', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
            { module: 'Staff', permissions: { add: true, edit: true, view: true, delete: false, approve: false } },
            { module: 'Student', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
            { module: 'University', permissions: { add: true, edit: true, view: true, delete: false, approve: true } },
        ],
    });

    await superAdminRole.save();
    await adminRole.save();
    console.log('Roles seeded successfully');
}

seedRoles().catch(console.error);
