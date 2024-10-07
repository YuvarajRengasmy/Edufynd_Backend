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
        console.log("pppp", userId)
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




export const publishPost = async (req, res) => {
    try {
        const pageId = req.params.pageId || 'me';  // Use 'me' if pageId is not provided
        const { message } = req.body;
    

        // Send the POST request to publish the post on the page's feed
        const response = await axios.post(`${BASE_URL}/114383625097415/feed`, null, {
            params: {
                message: message,
                access_token: accessToken  // Use the page access token
            }
        });

        console.log('Post created:', response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error publishing post:', error.response?.data || error.message);
        return res.status(500).json({ error: error.response?.data || 'Error publishing post' });
    }
};


export const facebookPost = async(req,res)=>{

    const {message, image} = req.body 
    await axios.post(`${BASE_URL}/114383625097415/photos?url=${image}?&message=${message}&access_token=${accessToken}`, null)
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err))

    // Send the POST request to publish the post on the page's feed
    const response = await axios.post(`${BASE_URL}/114383625097415/feed`, null, {
        params: {
            message: message,
            access_token: accessToken  // Use the page access token
        }
    });
}