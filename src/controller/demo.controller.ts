import { Demo, DemoDocument } from '../model/demo.model'
import { validationResult } from "express-validator";
import { response, } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "Demo";



export const getAllDemo = async (req, res) => {
    try {
        const data = await Demo.find().sort({ _id: -1 })
        response(req, res, activity, 'Level-1', 'GetAll-Demo', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Demo', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleDemo = async (req, res) => {
    try {
        const data = await Demo.findOne({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'GetSingle-Demo', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Demo', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let createDemo = async (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const DropdownListDetails: DemoDocument = req.body;
            const createData = new Demo(DropdownListDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Create-Demo', true, 200, insertData, clientError.success.savedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Create-Demo', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Create-Demo', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export const updateDemo = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const demoDetails: DemoDocument = req.body;
            let statusData = await Demo.findByIdAndUpdate({ _id: req.query._id }, {
                $set: {
                    name: demoDetails.name,
                    code: demoDetails.code,
                    modifiedOn: new Date(),
                    modifiedBy:  demoDetails.modifiedBy,
                },
                $addToSet: {
                   state: demoDetails.state,
               }
            });

            response(req, res, activity, 'Level-2', 'Update-Demo Details', true, 200, statusData, clientError.success.updateSuccess);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Demo Details', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Demo Details', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


export let deleteDemo = async (req, res, next) => {

        try {
            let id = req.query._id;
            const demo = await Demo.findByIdAndDelete({ _id: id })
            response(req, res, activity, 'Level-2', 'Deleted the Demo', true, 200, demo, 'Successfully Remove this Field');
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Deleted the Demo', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };



export let getFilteredDemo = async (req, res, next) => {
        try {
            var findQuery;
            var andList: any = []
            var limit = req.body.limit ? req.body.limit : 0;
            var page = req.body.page ? req.body.page : 0;
            andList.push({ isDeleted: false })
            andList.push({ status: 1 })
            if (req.body.name) {
                andList.push({ name: req.body.name })
            }
            if (req.body.code) {
                andList.push({ code: req.body.code })
            }  
            findQuery = (andList.length > 0) ? { $and: andList } : {}

            const dropDownList = await Demo.find(findQuery).sort({ _id: -1 }).limit(limit).skip(page)

            const dropDownCount = await Demo.find(findQuery).count()
            response(req, res, activity, 'Level-1', 'Get-Filter Demo', true, 200, { dropDownList, dropDownCount }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-Filter Demo', false, 500, {}, errorMessage.internalServer, err.message);
        }
    };


export const getCountryByState = async (req, res) => {
        const { name } = req.query; // Extract country from query params
        try {
            // Query universities based on country
            const demo = await Demo.find({ name: name });
            response(req, res, activity, 'Level-2', 'Get-Demo By State ', true, 200, demo, clientError.success.fetchedSuccessfully)
        } catch (err) {
            console.error('Error fetching universities:', err);
            response(req, res, activity, 'Level-3', 'Get-Demo By State ', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }


// export const getCountryByStateAndCity = async (req, res) => {
//         try {
//             const { country} = req.query;
    
//             console.log("Country name:", country);
    
//             // Find the country in the Country collection
//             const countries = await Country.findOne({ country: country }).exec();
//             console.log("66", country)
    
//             if (!countries) {
//                 return response(req, res, activity, 'Level-1', 'Get-Country-By-State-And-City', false, 404, {}, 'Country not found');
//             }
    
//             console.log("Country data:", countries);
    
//             // Find the matching state and city in the Demo collection
//             const list = await Demo.findOne({
//                 name: country,
//                 // 'state.StateName': stateName,
//                 // 'state.cities': cityName
//             }, {
//                 name: 1,
//                 code: 1,
//                 state: 1
//             }).exec();
//     console.log("909", list)
//             if (!list) {
//                 return response(req, res, activity, 'Level-1', 'Get-Country-By-State-And-City', false, 404, {}, 'State or city not found in the specified country');
//             }
    
//             console.log("Country list data:", list);
    
//             // Format the response data
//             const data = {
//                 countryName: list.name,
//                 code: list.code,
//                 state: list.state,
//                 length: list.state.length
//                 // state: list.state[0].name,
//                 // cities: list.state[0].cities
//             };

//             console.log("44", data)
    
//             // Send the response
//             response(req, res, activity, 'Level-1', 'Get-Country-By-State-And-City', true, 200, data, 'Data fetched successfully');
    
//         } catch (err) {
//             console.error(err);
//             response(req, res, activity, 'Level-1', 'Get-Country-By-State-And-City', false, 500, {}, 'Internal server error', err.message);
//         }
//     };



    export const getAllCities = async (req, res) => {
        const { state } = req.query;
    
        try {
            const countryList = await Demo.findOne({
                // name: country,
                'state.name': state
            }, {
                'state.$': 1
            }).exec();
    
            if (!countryList) {
                return res.status(404).json({
                    success: false,
                    message: 'State not found in the specified country'
                });
            }
    
            // Extract the cities from the matched state
            const cities = countryList.state[0].cities;
    
            // Send the response
            res.status(200).json({
                success: true,
                cities: cities,
                message: 'Cities fetched successfully'
            });
    
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    };




    // export const getCountryByStateAndCity = async (req, res) => {
    //     const { countryName, stateName, cityName } = req.query;
    
    //     try {
    //         // Find the matching state and city in the Demo collection
    //         const countryList = await Demo.findOne({
    //             name: countryName,
    //             'state.name': stateName,
    //             'state.cities': cityName
    //         }, {
    //             name: 1,
    //             code: 1,
    //             'state.$': 1
    //         }).exec();
    
    //         if (!countryList) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: 'State or city not found in the specified country'
    //             });
    //         }
    
    //         console.log("Country list data:", countryList);
    
    //         // Format the response data
    //         const data = {
    //             countryName: countryList.name,
    //             code: countryList.code,
    //             state: countryList.state[0].name,
    //             cities: countryList.state[0].cities
    //         };
    
    //         // Send the response
    //         res.status(200).json({
    //             success: true,
    //             data: data,
    //             message: 'Data fetched successfully'
    //         });
    
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Internal server error',
    //             error: err.message
    //         });
    //     }
    // };


  
    