import { User, UserDocument } from '../model/user.model'
import { validationResult } from 'express-validator'
import { response } from '../helper/commonResponseHandler'
import { clientError, errorMessage } from '../helper/ErrorMessage'

var activity = "User"


export const getAllUser = async(req, res, next)=>{
    try {
        const user = await User.find({isDeleted: false})
        response(req, res, activity,  "Level-1", "GetAll-User", true, 200, user, clientError.success.fetchedSuccessfully)
        
    } catch (err: any) {
        response(req, res, activity, "Level-1", 'GetAll-User', false, 500, {},  errorMessage.internalServer, err.message)
        
    }
}