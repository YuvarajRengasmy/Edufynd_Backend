import { Facebook,FaceBookDocument } from '../model/facebook.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import  axios  from 'axios'
import * as config from '../../config';


var activity = "Facebook";




const BASE_URL = 'https://graph.facebook.com';

 

const accessToken =config.SERVER.FACEBOOK_ACCESS_TOKEN
// Function to handle GET requests to the Graph API
export let getUserData =async (req, res) => {
    try {
        const userId = req.params.userId || 'me'; // Default to 'me' if no userId provided
        const response = await axios.get(`${BASE_URL}/${userId}`, {
            params: {
                access_token: accessToken,
                fields: 'id,name,email,picture'
            }
        });
        console.log(response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching user data:', error.response.data);
    }
}



async function getUserPhotos(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/${userId}/photos`, {
            params: {
                access_token: accessToken
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching user photos:', error.response.data);
    }
}


export const publishPost = async (req, res) =>{
    try {
        const pageId = req.params.pageId || 'me';
        const {message} = req.body
        const response = await axios.post(`${BASE_URL}/${pageId}/feed`, null, {
            params: {
                message: message,
                access_token: accessToken
            }
        });
        console.log('Post created:', response);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error publishing post:', error.response.data);
    }
}


