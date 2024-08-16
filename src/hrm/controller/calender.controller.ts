import { Calender, CalenderDocument } from '../model/calender.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";


var activity = "Calender";



export const getAllCalender = async (req: any, res:any, next:any) => {
    try {
        const data = await Calender.find().sort({ _id: -1 })
      
        response(req, res, activity, 'Level-1', 'GetAll-Calender', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetAll-Calender', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleCalender = async (req: any, res:any, next:any) => {
    try {
        const data = await Calender.findOne({ _id: req.query._id })
  
        response(req, res, activity, 'Level-1', 'GetSingle-Calender', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-2', 'GetSingle-Calender', false, 500, {}, errorMessage.internalServer, err.message)
    }
}




export let createCalender = async (req: any, res:any, next:any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const calenderDetails:CalenderDocument = req.body;
            const createData = new Calender(calenderDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-1', 'Create-Calender', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-2', 'Create-Calender', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Calender', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let updateCalender = async (req: any, res:any, next:any) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try{
          
            const calenderDetails: CalenderDocument = req.body;
            const updateData = await Calender.findOneAndUpdate({ _id: calenderDetails._id }, {
                $set: {  
                    title: calenderDetails.title,
                    date: calenderDetails.date,
                    isLeave: calenderDetails.isLeave,
            
                    modifiedOn: new Date(),
                 
                }
            });
            response(req, res, activity, 'Level-1', 'Update-Calender', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-2', 'Update-Calender', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Calender', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


    export let deleteCalender = async (req: any, res:any, next:any) => {

        try {
            let id = req.query._id;
            const country = await Calender.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Calender', true, 200, country, 'Successfully Remove the Calender Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Calender', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


    export let getFilteredCalender = async (req: any, res:any, next:any) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.title) {
                andList.push({ title: req.body.title })
            }
            if (req.body.date) {
                andList.push({ date: req.body.date })
            }
            if (req.body.isLeave) {
                andList.push({ isLeave: req.body.isLeave })
            }
            findQuery = (andList.length > 0) ? { $and: andList } : {}
         
            const calenderList = await Calender.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const calenderCount = await Calender.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Calender', true, 200, { calenderList, calenderCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Calender', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };