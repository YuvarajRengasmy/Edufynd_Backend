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







export let logChangesff = async function (document, method, changes = null, modelName = '') {
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
    
        // Helper function to remove HTML tags from a string
        const removeHtmlTags = (str) => {
            if (typeof str === 'string') {
                return str.replace(/<\/?[^>]+(>|$)/g, "").trim(); // Remove tags and trim spaces
            }
            return str;
        };
    
        // Loop through each key in changes.$set (user's explicit updates)
        for (const key of userUpdatedFields) {
            if (changes.$set.hasOwnProperty(key)) {
                // Only compare and log fields that are explicitly updated by the user
                if (key !== 'modifiedOn' && key !== 'createdOn' && document.hasOwnProperty(key)) {
                    let oldValue = document[key];
                    let newValue = changes.$set[key];
    
                    // Remove HTML tags if it's a text editor field 
                    if (typeof oldValue === 'string' && typeof newValue === 'string') {
                        oldValue = removeHtmlTags(oldValue);
                        newValue = removeHtmlTags(newValue);
                    }
    
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



//commission in year field to be check
export let logChangess = async function (document, method, changes = null, modelName = '') {
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
    
        // Function to compare years array in the model
        const compareYearsArray = (oldYears, newYears) => {
            let arraysAreEqual = true;
    
            if (oldYears.length !== newYears.length) {
                return false;
            }
    
            oldYears.forEach((oldYear, index) => {
                const newYear = newYears[index];
    
                // Compare the year field
                if (oldYear.year !== newYear.year) {
                    arraysAreEqual = false;
                }
    
                // Compare courseTypes within each year
                if (oldYear.courseTypes && newYear.courseTypes) {
                    if (oldYear.courseTypes.length !== newYear.courseTypes.length) {
                        arraysAreEqual = false;
                    }
    
                    oldYear.courseTypes.forEach((oldCourseType, courseIndex) => {
                        const newCourseType = newYear.courseTypes[courseIndex];
    
                        // Compare courseType field
                        if (oldCourseType.courseType !== newCourseType.courseType) {
                            arraysAreEqual = false;
                        }
    
                        // Compare inTake and value fields
                        if (oldCourseType.inTake && newCourseType.inTake) {
                            if (oldCourseType.inTake.length !== newCourseType.inTake.length) {
                                arraysAreEqual = false;
                            }
    
                            oldCourseType.inTake.forEach((oldInTake, inTakeIndex) => {
                                const newInTake = newCourseType.inTake[inTakeIndex];
    
                                // Compare inTake and value
                                if (oldInTake.inTake !== newInTake.inTake || oldInTake.value !== newInTake.value) {
                                    arraysAreEqual = false;
                                }
                            });
                        }
                    });
                }
            });
    
            return arraysAreEqual;
        };
    
        // Loop through each key in changes.$set (user's explicit updates)
        for (const key of userUpdatedFields) {
            if (changes.$set.hasOwnProperty(key)) {
                // Only compare and log fields that are explicitly updated by the user
                if (key !== 'modifiedOn' && key !== 'createdOn' && document.hasOwnProperty(key)) {
                    let oldValue = document[key];
                    let newValue = changes.$set[key];
    
                    console.log("ppp", oldValue)
                    console.log("ooo", newValue)
                    console.log("www", key)
                    // Handle specific comparison for "years" field
                    if (key === 'years' || 'year') {
                        // Check if the "years" field is being updated and is an array
                        if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                            const yearsAreEqual = compareYearsArray(oldValue, newValue);
    
                            // Log changes if years array is different
                            if (!yearsAreEqual) {
                                changedFields.push({
                                    field: key,
                                    oldValue: oldValue,
                                    newValue: newValue
                                });
                            }
                        }
                    }
                    // Check if the field is an array (for other arrays)
                    else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
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