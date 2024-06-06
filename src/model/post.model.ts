import mongoose from "mongoose"

export interface postDocument extends mongoose.Document{
    userId?:any;
    title?:string;
    media?:string;
    description?:string;
    like?:string;
    likeCount?:string;
    comments?:string;
    isDeleted?:boolean;
    report?:Number
    postCount?:Number;
}
const postSchema= new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId},
    title:{type:String},
    media:{type:String},
    description:{type:String},
    like:{type:String},
    likeCount:{type:String},
    comments:[{
        name:{type:String},
        comment:{type:String}}],

  isDeleted:{type:Boolean,
            default:false},

    report:{type:Number},
    postCount:{type:Number}

})
export const postCollection= mongoose.model("postdetail",postSchema);