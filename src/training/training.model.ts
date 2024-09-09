import * as mongoose from 'mongoose'



export interface TrainingDocument extends mongoose.Document {
    requestTraining?: string;
    trainingTopic?: string;
    date?: Date;
    time?: string;
    typeOfUser?: string;
    usersName?: any[];
    userEmail?: any[];
    material?: string;
    name?: string;
    subject?: string;
    content?: string;
    uploadDocument?: string;


    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const trainingSchema = new mongoose.Schema({

    requestTraining: { type: String },
    trainingTopic: { type: String },
    date: { type: Date },
    time: { type: String },

    typeOfUser: { type: String },
    usersName: [String],
    userEmail: [String],
    material: { type: String },
    name: { type: String },
    subject: { type: String },
    content: { type: String },
    uploadDocument: { type: String },

    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})


export const Training = mongoose.model("Training", trainingSchema)