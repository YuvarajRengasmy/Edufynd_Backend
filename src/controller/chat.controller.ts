import SuperAdmin from 'src/model/superAdmin.model';
import { response } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
import { ChatMessage, chatMessageDocument } from '../model/chat.model';
import {DateTime} from 'luxon';



var activity = "chatuser";



export const userSendMessages = async (req, res, next) => {
  try {
    const chatDetails = req.body;
    if (!chatDetails.superAdminId || !chatDetails.staffId) {
      response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both superAdminId and staffId are required');
    }
    if (chatDetails.superAdminId === chatDetails.staffId) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
    }

    const currentTime = DateTime.now().setZone('Asia/Kolkata');
    chatDetails.sentOn = currentTime.toFormat('hh:mm a');

    const senderType = 'superAdmin';
    const newMessage = await ChatMessage.create({
      superAdminId: chatDetails.superAdminId,
      staffId: chatDetails.staffId,
      message: chatDetails.message,
      senderType: senderType,
      sentOn: chatDetails.sentOn,
      isSeen:chatDetails.isSeen 
    });

    const io = req.app.get('socketio');
    if (io) {
      io.emit('userStatus', { superAdminId: chatDetails.superAdminId, status: 'online' });
      io.emit('userStatus', { StaffId: chatDetails.staffId, status: 'online' });
    }

    await newMessage.save();
    const sentOnTime = currentTime.toFormat('hh:mm a')
    response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, { sentOnTime });
  } catch (err: any) {
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
};

export const doctorSendMessages = async (req, res, next) => {
  try {
    const chatDetails = req.body;
    if (!chatDetails.superAdminId || !chatDetails.staffId) {
      response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both superAdminId and staffId are required');
    }
    if (chatDetails.superAdminId === chatDetails.staffId) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
    }

    const currentTime = DateTime.now().setZone('Asia/Kolkata');
    chatDetails.sentOn = currentTime.toFormat('hh:mm a');

    const senderType = 'staff';
    const newMessage = await ChatMessage.create({
      superAdminId: chatDetails.superAdminId,
      staffId: chatDetails.staffId,
      message: chatDetails.message,
      senderType: senderType,
      sentOn: chatDetails.sentOn,
      isSeen:chatDetails.isSeen
    });
    const io = req.app.get('socketio');
    if (io) {
      io.emit('userStatus', { superAdminId: chatDetails.superAdminId, status: 'online' });
      io.emit('userStatus', { staffId: chatDetails.staffId, status: 'online' });
    }

    await newMessage.save();
    const sentOnTime = currentTime.toFormat('hh:mm a');
    response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
  } catch (err:any) {
   response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
};
// export const StudentSendMessages = async (req, res, next) => {
//   console.log("pp")
//   try {
//     const chatDetails = req.body;
//     if (!chatDetails.studentId || !chatDetails.staffId) {
//       response(req, res, activity, 'Level-1', 'Chat', false, 400, {}, 'Both studentId and staffId are required');
//     }
//     if (chatDetails.studentId === chatDetails.staffId) {
//       response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, 'Cannot send message to yourself');
//     }

//     const currentTime = DateTime.now().setZone('Asia/Kolkata');
//     chatDetails.sentOn = currentTime.toFormat('hh:mm a');

//     const senderType = 'staff';
//     const newMessage = await ChatMessage.create({
//       studentId: chatDetails.studentId,
//       staffId: chatDetails.staffId,
//       message: chatDetails.message,
//       senderType: senderType,
//       sentOn: chatDetails.sentOn,
//       isSeen:chatDetails.isSeen
//     });
//     console.log("kk", newMessage)
//     const io = req.app.get('socketio');
//     if (io) {
//       io.emit('userStatus', { studentId: chatDetails.studentId, status: 'online' });
//       io.emit('userStatus', { staffId: chatDetails.staffId, status: 'online' });
//     }

//     await newMessage.save();
//     const sentOnTime = currentTime.toFormat('hh:mm a');
//     response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, {sentOnTime});
//   } catch (err:any) {
//    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };



    export const getUserSentChats = async (req, res, next) => {
      try {
        const { superAdminId } = req.query;
        const userSentChats = await ChatMessage.find({superAdminId,senderType: 'superAdmin',}).populate('superAdminId',{name:1,photo:1}).populate('staffId',{empName:1,photo:1}); 
    
        response(req, res, activity, 'Level-2', 'Chat', true, 200, userSentChats, clientError.success.fetchedSuccessfully);
      } catch (err:any) {
      response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
      }

};


export let getDoctorChats = async (req, res, next) => {
  try{
    const { staffId } = req.query;
    const doctorSentDetails = await ChatMessage.find({staffId,senderType: 'staff',}).populate('superAdminId',{name:1,photo:1}).populate('staffId',{empName:1,photo:1});;
    response(req, res, activity, 'Level-2', 'Chat', true, 200, doctorSentDetails, clientError.success.fetchedSuccessfully);
  }
  catch(err:any){
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }

}


export let getAllChats = async (req, res, next) => {
  try{
    const chatDetails = await ChatMessage.find({isDeleted: false}).populate('superAdminId',{name:1,photo:1}).populate('staffId',{empName:1,photo:1});
    response(req, res, activity, 'Level-2', 'Chat', true, 200, chatDetails, clientError.success.fetchedSuccessfully);
  }
  catch(err:any){
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
  }
}






export const markMessageAsSeen = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    const message = await ChatMessage.findById(messageId);

    if (!message) {
      response(req, res, activity, 'Level-3', 'Chat', false, 404, {}, 'Message not found');
    }

    message.isSeen = true;
    await message.save();

    const io = req.app.get('socketio');
    if (io) {
      io.emit('messageSeen', { superAdminId: message.superAdminId, staffId: message.staffId, messageId: message._id });
    }

    response(req, res, activity, 'Level-2', 'Chat', true, 200, {}, 'Updated successfully', {});
  } catch (err) {
    response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, 'Internal server error', err.message);
  }
};


//   userSendMessages,
//   markMessageAsSeen,
// };
// 3. Router (routes/chatRoutes.js):

// javascript
// Copy code
// // routes/chatRoutes.js
// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chatController');

// // Routes
// router.post('/send', chatController.userSendMessages);
// router.put('/markSeen/:messageId', chatController.markMessageAsSeen);

// module.exports = router;




// Import necessary libraries
// import { DateTime } from 'luxon';

// export const userSendMessages = async (req, res, next) => {
//   try {
//     const chatDetails = req.body;
//     // ... (your existing validation code)

//     const currentTime = DateTime.now().setZone('Asia/Kolkata');
//     chatDetails.sentOn = currentTime.toFormat('hh:mm a');

//     const senderType = 'user';
//     const newMessage = await ChatMessage.create({
//       superAdminId: chatDetails.superAdminId,
//       staffId: chatDetails.staffId,
//       message: chatDetails.message,
//       senderType: senderType,
//       sentOn: chatDetails.sentOn,
//       // Add a field to track whether the message has been seen
//       seen: false,
//     });

//     const io = req.app.get('socketio');
//     if (io) {
//       // Emit event for a new message
//       io.emit('newMessage', { superAdminId: chatDetails.superAdminId, staffId: chatDetails.staffId, message: newMessage });

//       io.emit('userStatus', { superAdminId: chatDetails.superAdminId, status: 'online' });
//       io.emit('userStatus', { staffId: chatDetails.staffId, status: 'online' });
//     }

//     await newMessage.save();
//     const sentOnTime = currentTime.toFormat('hh:mm a')
//     response(req, res, activity, 'Level-2', 'Chat', true, 200, newMessage, clientError.success.fetchedSuccessfully, { sentOnTime });
//   } catch (err: any) {
//     response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };

// // Add a new route/handler to mark a message as seen
// export const markMessageAsSeen = async (req, res, next) => {
//   try {
//     const messageId = req.params.messageId;
//     const message = await ChatMessage.findById(messageId);

//     if (!message) {
//       response(req, res, activity, 'Level-3', 'Chat', false, 404, {}, 'Message not found');
//       return;
//     }

//     message.seen = true;
//     await message.save();

//     const io = req.app.get('socketio');
//     if (io) {
//       // Emit event for a message being seen
//       io.emit('messageSeen', { superAdminId: message.superAdminId, staffId: message.staffId, messageId: message._id });
//     }

//     response(req, res, activity, 'Level-2', 'Chat', true, 200, {}, clientError.success.updatedSuccessfully, {});
//   } catch (err: any) {
//     response(req, res, activity, 'Level-3', 'Chat', false, 500, {}, errorMessage.internalServer, err.message);
//   }
// };
// In the code above, I added a new field seen to the ChatMessage model to track whether the message has been seen. Additionally, I added two new events, newMessage and messageSeen, that can be emitted to notify clients about new messages and when a user has seen a message, respectively.

// On the client side, you need to listen for these events and update the UI accordingly. Here's an example in JavaScript (assuming you're using socket.io on the client as well):

// javascript
// Copy code
// // Assuming you have a socket instance
// const socket = io();

// // Listen for new messages
// socket.on('newMessage', (data) => {
//   // Update your UI to display the new message
//   console.log('New Message:', data.message);
// });

// // Listen for message seen events
// socket.on('messageSeen', (data) => {
//   // Update your UI to mark the message as seen
//   console.log('Message Seen:', data.messageId);
// });

// // Call this function when a user sees a message
// function markMessageAsSeen(messageId) {
//   // Emit an event to notify the server that the message has been seen
//   socket.emit('markMessageAsSeen', { messageId });
// }






// const MessageComponent = ({ messageId }) => {
//   const [isSeen, setIsSeen] = useState(false);

//   const markAsSeen = async () => {
//     try {
//       await axios.put(`/api/markMessageAsSeen/${messageId}`);
//       setIsSeen(true);
//     } catch (error) {
//       console.error('Error marking message as seen:', error.message);
//       // Handle error as needed
//     }
//   };

//   return (
//     <div>
//       <p>{/* Display your message here */}</p>
//       {!isSeen && (
//         <button onClick={markAsSeen}>
//           Mark as Seen
//         </button>
//       )}
//     </div>
//   );
// };