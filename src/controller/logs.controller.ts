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
export let saveLogs = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const LogsData: LogsDocument = req.body;
            const createLogs = new Logs(LogsData);
          
            let insertLogs = await createLogs.save();
            response(req, res, activity, 'Save-Logs', 'Level-2', true, 200, insertLogs, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Save-Logs', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Save-Logs', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

export let saveLog = async (params: LogsDocument) => {
    console.log("pppp", params)
    const LogsData: LogsDocument = params;
    const createLogs = new Logs(LogsData);
    return await createLogs.save();
}