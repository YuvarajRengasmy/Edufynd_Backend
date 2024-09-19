import { Commission, CommissionDocument } from '../model/commission.model'
import { Logs } from "../model/logs.model";
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Commission";

export const getAllCommission = async (req, res) => {
    try {
        const data = await Commission.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Commission', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Commission', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let getAllLoggedCommission = async (req, res, next) => {
  try {
      const data = await Logs.find({ modelName: "Commission" })
      response(req, res, activity, 'Level-1', 'All-Logged Commission', true, 200, data, clientError.success.fetchedSuccessfully);
  } catch (err: any) {
      response(req, res, activity, 'Level-2', 'All-Logged Commission', false, 500, {}, errorMessage.internalServer, err.message);
  }
};


export const getSingleCommission = async (req, res) => {
    try {
        const data = await Commission.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

export const getSingleUniversity = async (req, res) => {
    try {
        const data = await Commission.findOne({universityId:req.query.universityId})
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Commission', false, 500, {}, errorMessage.internalServer, err.message)
    }
}



export let createCommission = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const commission = await Commission.findOne({ universityName: req.body.universityName });
            if(!commission){
            const commissionDetails: CommissionDocument = req.body;
            commissionDetails.createdOn = new Date()
            const createData = new Commission(commissionDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-1', 'Create-Commission', true, 200, insertData, clientError.success.savedSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-2', 'Create-Commission', true, 422, {}, 'University Name already registered for Commission');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Commission', false, 500, {}, errorMessage.fieldValidation, err.message);
        }
    
    } else {
        response(req, res, activity, 'Level-3', 'Create-Commission', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};







export let deleteCommission = async (req, res, next) => {
        try {
            let id = req.query._id;
            const country = await Commission.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Commission', true, 200, country, 'Successfully Remove the Commission Details');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



export let getFilteredCommission = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
           
            if (req.body.universityName) {
                andList.push({ universityName: req.body.universityName })
            }
            if (req.body.commissionPaidOn) {
                andList.push({ commissionPaidOn: req.body.commissionPaidOn })
            }
            if (req.body.paymentMethod) {
                andList.push({ paymentMethod: req.body.paymentMethod })
            }
            if (req.body.tax) {
                andList.push({ tax: req.body.tax })
            }
           
            findQuery = (andList.length > 0) ? { $and: andList } : {}
         
            const dropDownList = await Commission.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await Commission.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Commission', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };





//////

export let updateCommissioncorrect = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const { commissionId, year, courseType, intake,} = req.body;
  
        // Update logic for removing a specific intake
        const updateData = await Commission.findOneAndUpdate(
          { _id: commissionId },
          {
            $pull: {
              "years.$[yearElem].courseTypes.$[courseTypeElem].inTake": { inTake: intake }
            }
          },
          {
            arrayFilters: [
              { "yearElem.year": year },
              { "courseTypeElem.courseType": courseType }
            ],
            new: true
          }
        );
  
        // If no intake, remove the courseType
        if (updateData) {
          const courseTypeData = updateData.years
            .find((yr) => yr.year === year)
            ?.courseTypes.find((ct) => ct.courseType === courseType);
  
          if (courseTypeData?.inTake.length === 0) {
            await Commission.findOneAndUpdate(
              { _id: commissionId },
              {
                $pull: {
                  "years.$[yearElem].courseTypes": { courseType }
                }
              },
              {
                arrayFilters: [{ "yearElem.year": year }],
                new: true
              }
            );
          }
        }
  
        response(req, res, activity, 'Level-2', 'Update-Commission', true, 200, updateData, clientError.success.updateSuccess);
      } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-Commission', false, 500, {}, errorMessage.internalServer, err.message);
      }
    } else {
      response(req, res, activity, 'Level-3', 'Update-Commission', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
  };

  

  export const deleteIntake = async (req, res) => {
    const { commissionId, year, courseType, intake } = req.body;
  
    try {
      // Remove the specific intake
      const updateResult = await Commission.findOneAndUpdate(
        { _id: commissionId },
        {
          $pull: {
            "years.$[yearElem].courseTypes.$[courseTypeElem].inTake": { inTake: intake }
          }
        },
        {
          arrayFilters: [
            { "yearElem.year": year },
            { "courseTypeElem.courseType": courseType }
          ],
          new: true
        }
      );
  
      // If no intake is left, remove the courseType
      if (updateResult) {
        const courseTypeData = updateResult.years
          .find((yr) => yr.year === year)
          ?.courseTypes.find((ct) => ct.courseType === courseType);
  
        if (courseTypeData?.inTake.length === 0) {
          await Commission.findOneAndUpdate(
            { _id: commissionId },
            {
              $pull: {
                "years.$[yearElem].courseTypes": { courseType }
              }
            },
            {
              arrayFilters: [{ "yearElem.year": year }],
              new: true
            }
          );
        }
      }

      response(req, res, activity, 'Level-2', 'Deleted the Intake', true, 200, {}, 'Intake deleted successfully');
    } catch (err) {
        response(req, res, activity, 'Level-3', 'Deleted the Intake', false, 500, {}, 'Error occur while deleting' );
    }
  };


  export const deleteCourseType =async (req, res) => {
    const { commissionId, year, courseType } = req.body;
  
    try {
      // Find the commission document
      const commission = await Commission.findById(commissionId);
  
      if (!commission) {
        return res.status(404).json({ message: 'Commission not found' });
      }
  
      // Find the year index and courseType index
      const yearIndex = commission.years.findIndex(y => y.year === year);
      if (yearIndex === -1) {
        return res.status(404).json({ message: 'Year not found' });
      }
  
      const courseTypeIndex = commission.years[yearIndex].courseTypes.findIndex(ct => ct.courseType === courseType);
      if (courseTypeIndex === -1) {
        return res.status(404).json({ message: 'Course Type not found' });
      }
  
      // Remove the courseType
      commission.years[yearIndex].courseTypes.splice(courseTypeIndex, 1);
  
      // Remove the year if no courseTypes are left
      if (commission.years[yearIndex].courseTypes.length === 0) {
        commission.years.splice(yearIndex, 1);
      }
  
      // Save the updated commission document
      await commission.save();
      response(req, res, activity, 'Level-2', 'Deleted the Course Type', true, 200, {}, 'Course Type  deleted successfully');
    } catch (error) {
    
      response(req, res, activity, 'Level-3', 'Deleted the Course Type', false, 500, {}, 'Error occur while deleting' );
    }
  }






  export let updateCommission = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const { commissionId, year, courseType, intake } = req.body;
            const otherFields: CommissionDocument = req.body;

            // Log the other fields for debugging
            console.log("Updating fields: ", otherFields);

            // First, try to remove the specific intake (if it exists)
            let updateData = null;
            try {
                updateData = await Commission.findOneAndUpdate(
                    { _id: commissionId },
                    {
                        $pull: {
                            "years.$[yearElem].courseTypes.$[courseTypeElem].inTake": { inTake: intake }
                        }
                    },
                    {
                        arrayFilters: [
                            { "yearElem.year": year },
                            { "courseTypeElem.courseType": courseType }
                        ],
                        new: true
                    }
                );
            } catch (error) {
                console.error("Error pulling intake:", error.message);
            }

            // If no intake remains, remove the courseType
            if (updateData) {
                const courseTypeData = updateData.years
                    .find((yr) => yr.year === year)
                    ?.courseTypes.find((ct) => ct.courseType === courseType);

                if (courseTypeData?.inTake.length === 0) {
                    await Commission.findOneAndUpdate(
                        { _id: commissionId },
                        {
                            $pull: {
                                "years.$[yearElem].courseTypes": { courseType }
                            }
                        },
                        {
                            arrayFilters: [{ "yearElem.year": year }],
                            new: true
                        }
                    );
                }
            }

            // Continue to update other commission details regardless of the previous steps
            const updateDetails = await Commission.findOneAndUpdate(
                {  _id: otherFields._id },
                {
                    $set: {
                        country: otherFields.country,
                        universityName: otherFields.universityName,
                        paymentMethod: otherFields.paymentMethod,
                        amount: otherFields.amount,
                        percentage: otherFields.percentage,
                        commissionPaidOn: otherFields.commissionPaidOn,
                        eligibility: otherFields.eligibility,
                        tax: otherFields.tax,
                        paymentType: otherFields.paymentType,
                        currency: otherFields.currency,
                        flag: otherFields.flag,
                        clientName: otherFields.clientName,
                        modifiedOn: new Date(),
                        modifiedBy: otherFields.modifiedBy,
                    },
                },
                { new: true }  // This ensures the updated document is returned
            );

            // Check if update was successful
            if (!updateDetails) {
                throw new Error('Failed to update commission details');
            }

            console.log("Updated details: ", updateDetails);

            response(req, res, activity, 'Level-2', 'Update-Commission', true, 200, updateDetails, clientError.success.updateSuccess);
        } catch (err: any) {
            console.error("Error updating commission:", err.message);
            response(req, res, activity, 'Level-3', 'Update-Commission', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Commission', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


