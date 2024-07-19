import * as jwt from 'jsonwebtoken';
import { response } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
import * as config from '../config';
const activity = 'token';

/**
 * @author Balan K K
 * @date 01-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to token creation
 */


export let CreateJWTToken = (data: any = {}) => {

    let tokenData = {};
    if (data && data['name']) {
        tokenData['name'] = data['name']
    }
    if (data && data['loginType']) {
        tokenData['loginType'] = data['loginType']
    }
    if (data && data['id']) {
        tokenData['id'] = data['id']
    }
  
    const token = jwt.sign(tokenData, 'edufynd', { expiresIn: '24h' });
    return token;
}



/**
 * @author Ponjothi S
 * @date 07-09-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Chech the session and Verify the token
 */
// export let checkSession = async (req, res, next) => {
//     console.log("jfhfh")
//     const token = await req.headers['token'];
// console.log("k", token)
//     if (token) {
//         const headerType = token.split(' ')[0];
  
//         const tokenValue = token.split(' ')[1].trim();
//         if (headerType.trim() === "Bearer") {
//             try {
//                 await jwt.verify(tokenValue, 'edufynd', function (err, tokendata) {
//                     if (err) {
//                         return res.status(400).json({ message: clientError.token.sessionExpire })
//                                 }
//                     if (tokendata) {
//                         console.log('tokendata',tokendata);
//                         req.body.loginId = tokendata.userId;
//                         req.body.loginUserName = tokendata.userName;
//                         req.body.createdBy = tokendata.userName;
//                         req.body.createdOn = new Date();
//                         req.body.modifiedBy = tokendata.userName;
//                         req.body.modifiedOn = new Date();
//                         next();
//                     }
//                 });
//             } catch (err: any) {
//                 return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute, err.message);
//             }
//         }
//     } else {
//         return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute);
//     }
// }


// export let checkSession = async (req, res, next) => {
//     console.log("jfhfh");
    
//     // Get the token from the authorization header
//     console.log("uu", req.headers)
//     const token = req.headers['authorization'];
//     // const token = req.headers['token'];
//     console.log("k", token);

//     if (token) {
//         console.log("88", token)
//         const parts = token.split(' ');
//         const headerType = parts[0];
//         const tokenValue = parts[1]?.trim(); // Use optional chaining to prevent errors if tokenValue is undefined
// console.log("22", tokenValue)
// console.log("44", headerType)
//         if (headerType === "Bearer" && tokenValue) {
//             console.log("33", tokenValue)
//             try {
//                 const tokendata = await jwt.verify(tokenValue, 'edufynd');
//                 console.log('tokendata', tokendata);

//                 req.body.loginId = tokendata.userId;
//                 req.body.loginUserName = tokendata.userName;
//                 req.body.createdBy = tokendata.userName;
//                 req.body.createdOn = new Date();
//                 req.body.modifiedBy = tokendata.userName;
//                 req.body.modifiedOn = new Date();
//                 next();
//             } catch (err) {
//                 console.error(err);
//                 return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute, err.message);
//             }
//         } else {
//             return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.sessionExpire);
//         }
//     } else {
//         return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute);
//     }
// };


// export let checkSession = async (req, res, next) => {
//     console.log("Entering checkSession middleware");
  
//     let authHeader = req.headers['authorization'];
//     console.log("Authorization Header:", authHeader);
  
   

//     if (authHeader) {
//         const parts = authHeader.split(' ');
//         console.log("yy", parts)
//         const headerType = parts[0];
//         console.log("77", headerType)
//         const tokenValue = parts[1]?.trim();
//         console.log("tt", tokenValue)

//         if (headerType === "Bearer" && tokenValue) {
//             console.log("Token Value:", tokenValue);
//             try {
//                 const tokendata = await jwt.verify(tokenValue, 'edufynd');
//                 console.log('Token data:', tokendata);

//                 req.body.loginId = tokendata.userId;
//                 req.body.loginUserName = tokendata.userName;
//                 req.body.createdBy = tokendata.userName;
//                 req.body.createdOn = new Date();
//                 req.body.modifiedBy = tokendata.userName;
//                 req.body.modifiedOn = new Date();
//                 next();
//             } catch (err) {
//                 console.error("JWT Verification Error:", err);
//                 return response(req, res,activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute, err.message);
//             }
//         } else {
//             console.error("Invalid token format or missing token");
//             return response(req, res,activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.sessionExpire);
//         }
//     } else {
//         console.error("Authorization header not found");
//         return response(req, res, activity,'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute);
//     }
// };





export let checkSession = async (req, res, next) => {
    console.log("Entering checkSession middleware");
  
    // let authHeader = req.headers['authorization'];
    let authHeader = req.headers['token'];
    console.log("Authorization Header:", authHeader);
//   
    if (authHeader) {
        const parts = authHeader.split(' ');
        const headerType = parts[0];
        const tokenValue = parts[1]?.trim();

        if (headerType === "Bearer" && tokenValue) {
            console.log("Token Value:", tokenValue);
            try {
                const tokendata = await jwt.verify(tokenValue, 'edufynd');
                console.log('Token data:', tokendata);

                req.body.loginId = tokendata.userId;
                req.body.loginUserName = tokendata.userName;
                req.body.createdBy = tokendata.userName;
                req.body.createdOn = new Date();
                req.body.modifiedBy = tokendata.userName;
                req.body.modifiedOn = new Date();
                next();
            } catch (err) {
                console.error("JWT Verification Error:", err);
                return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute, err.message);
            }
        } else if (headerType === "Basic" && tokenValue) {
            const credentials = Buffer.from(tokenValue, 'base64').toString('utf-8').split(':');
            const username = credentials[0];
            const password = credentials[1];
            console.log("Basic Auth - Username:", username);
            console.log("Basic Auth - Password:", password);

            // Validate the username and password as per your logic here
            if (username === config.SERVER.BASIC_AUTH_USER && password === config.SERVER.BASIC_AUTH_PWD) {
         
                next();
            } else {
                console.error("Invalid Basic Auth credentials");
                return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute);
            }
        } else {
            console.error("Invalid token format or missing token");
            return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.sessionExpire);
        }
    } else {
        console.error("Authorization header not found");
        return response(req, res, activity, 'Check-Session', 'Level-3', false, 499, {}, clientError.token.unauthRoute);
    }
};