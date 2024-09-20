import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { LogsDocument, Logs } from "../model/logs.model";



var activity = 'LOGS';

/**
 * @author Balan K K
 * @date 01-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Logs
 */

// export let saveLogs = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const LogsData: LogsDocument = req.body;
//             const createLogs = new Logs(LogsData);
          
//             let insertLogs = await createLogs.save();
//             response(req, res, activity, 'Save-Logs', 'Level-2', true, 200, insertLogs, clientError.success.savedSuccessfully);
//         } catch (err: any) {
//             response(req, res, activity, 'Save-Logs', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {
//         response(req, res, activity, 'Save-Logs', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// };

// export let saveLog = async (params: LogsDocument) => {
  
//     const LogsData: LogsDocument = params;
//     const createLogs = new Logs(LogsData);
//     return await createLogs.save();
// }





export let logChangesss = async function (document, method, changes = null, modelName = '') {
    const changedFields = [];

    // For delete operation, log the entire document as one object
    if (method === 'delete') {
        const deletedData = { ...document}; // Convert to plain object
        const logEntry = {
            userType: document.createdBy || '', // Assuming the user making the change
            userId: document.loginId,
            documentId: document._id,
            method,
            deletedData, // Store the whole deleted document here
            date: new Date(),
            modelName: modelName // For consistency
        };

        const createLogs = new Logs(logEntry);
        await createLogs.save();
        return;
    }
   // For update operation, log field-level changes
   if (method === 'update' && changes && changes.$set && document) {
    const userUpdatedFields = Object.keys(changes.$set); // Fields the user explicitly updated

    // Loop through each key in changes.$set (user's explicit updates)
    for (const key of userUpdatedFields) {
        if (changes.$set.hasOwnProperty(key)) {
            // Only compare and log fields that are explicitly updated by the user
            if (key !== 'modifiedOn' && key !== 'createdOn' && document.hasOwnProperty(key)) {
                const oldValue = document[key];
                const newValue = changes.$set[key];

                // Check if the field is an array
                if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                    // Compare array values element by element
                    const arraysAreEqual = oldValue.length === newValue.length &&
                        oldValue.every((element, index) => element === newValue[index]);

                    // Log if arrays are different
                    if (!arraysAreEqual) {
                        changedFields.push({
                            field: key,
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                } 
                // For non-array fields, log if the old value is different from the new value
                else if (oldValue !== newValue && newValue !== undefined && newValue !== null) {
                    changedFields.push({
                        field: key,
                        oldValue: oldValue,
                        newValue: newValue
                    });
                }
            }
        }
    }
}

    // Only log if there are changes (for update)
    if (changedFields.length > 0) {
        const logEntry = {
            userType: document.createdBy || '', // Assuming the user making the change
            userId: document.loginId,
            documentId: document._id,
            method,
            changes: changedFields, // Store changes with old and new values (or just the old values for delete)
            date: new Date(),
            modelName: modelName // For consistency
        };

        const createLogs = new Logs(logEntry);
        await createLogs.save();
    }
};


export let logChanges = async function (document, method, changes = null, modelName = '') {
    const changedFields = [];

    // For delete operation, log the entire document as one object
    if (method === 'delete') {
        const deletedData = { ...document}; // Convert to plain object
        const logEntry = {
            userType: document.createdBy || '', // Assuming the user making the change
            userId: document.loginId,
            documentId: document._id,
            method,
            deletedData, // Store the whole deleted document here
            date: new Date(),
            modelName: modelName // For consistency
        };

        const createLogs = new Logs(logEntry);
        await createLogs.save();
        return;
    }
    if (method === 'update' && changes && changes.$set && document) {
        const userUpdatedFields = Object.keys(changes.$set); // Fields the user explicitly updated
    
        // Helper function to do a deep comparison between two objects
        const deepEqual = (obj1, obj2) => {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        };
    
        // Loop through each key in changes.$set (user's explicit updates)
        for (const key of userUpdatedFields) {
            if (changes.$set.hasOwnProperty(key)) {
                // Only compare and log fields that are explicitly updated by the user
                if (key !== 'modifiedOn' && key !== 'createdOn' && document.hasOwnProperty(key)) {
                    const oldValue = document[key];
                    const newValue = changes.$set[key];
    
                    // Check if the field is an array
                    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                        // Check if the array is an array of objects
                        const isArrayOfObjects = oldValue.every(item => typeof item === 'object') && newValue.every(item => typeof item === 'object');
    
                        if (isArrayOfObjects) {
                            // Compare array of objects element by element
                            const arraysAreEqual = oldValue.length === newValue.length &&
                                oldValue.every((element, index) => deepEqual(element, newValue[index]));
    
                            // Log if arrays are different
                            if (!arraysAreEqual) {
                                changedFields.push({
                                    field: key,
                                    oldValue: oldValue,
                                    newValue: newValue
                                });
                            }
                        } else {
                            // Compare arrays that aren't objects (e.g., arrays of primitives)
                            const arraysAreEqual = oldValue.length === newValue.length &&
                                oldValue.every((element, index) => element === newValue[index]);
    
                            // Log if arrays are different
                            if (!arraysAreEqual) {
                                changedFields.push({
                                    field: key,
                                    oldValue: oldValue,
                                    newValue: newValue
                                });
                            }
                        }
                    } 
                    // For non-array fields, log if the old value is different from the new value
                    else if (oldValue !== newValue && newValue !== undefined && newValue !== null) {
                        changedFields.push({
                            field: key,
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                }
            }
        }
    }
    
    // Only log if there are changes (for update)
    if (changedFields.length > 0) {
        const logEntry = {
            userType: document.createdBy || '', // Assuming the user making the change
            userId: document.loginId,
            documentId: document._id,
            method,
            changes: changedFields, // Store changes with old and new values (or just the old values for delete)
            date: new Date(),
            modelName: modelName // For consistency
        };

        const createLogs = new Logs(logEntry);
        await createLogs.save();
    }
};