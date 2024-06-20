import { Contact,ContactDocument} from '../model/contact.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Contact";


export let createContact = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
                const contactDetails: ContactDocument = req.body;
                const createData = new Contact(contactDetails);
                let insertData = await createData.save();
             
                response(req, res, activity, 'Level-2', 'Contact-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Contact-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Contact-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}