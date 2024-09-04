import * as mongoose from 'mongoose'


export interface BlogDocument extends mongoose.Document {
  title?: string;
  slug?: string;
  summary?: string;
  keyWords?: string;
  show?: string;
  hide?: string;
  addToFeatured?: string;
  addToBreaking?: string;
  addToSlider?: string;
  addToRecommended?: string;
  showOnlyToRegisteredUsers?: string;
  tags?: any[];
  optionalURL?: string;
  content?: string;
  uploadFile?:any[];
  uploadImage?: string;
  addImageURL?: string;
  imageDescription?: string;
  uploadFiles?: string;
  language?: string;
  category?: string;
  subCategory?: string;
  schedulePost?: string;
  dateOfPublished?: Date;

  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}


const blogSchema = new mongoose.Schema({
  title: {type: String},
  slug: {type: String},
  summary: {type: String},
  keyWords: {type:String},
  show: {type: String},
  hide: {type: String},
  addToFeatured: {type: String},
  addToBreaking: {type: String},
  addToSlider: {type: String},
  addToRecommended:{type: String},
  showOnlyToRegisteredUsers: {type: String},
  tags:[String],
  optionalURL: {type: String},
  content: {type: String},
  uploadFile: [{fileName: { type: String}, uploadImage: { type: String} }],
  addImageURL: {type: String},
  imageDescription: {type: String},
  uploadFiles: {type: String},
  language: {type: String},
  category: {type: String},
  subCategory: {type: String},
  schedulePost: {type: String},
  dateOfPublished: {type: Date},


  createdOn: { type: Date, default: Date.now() },
  createdBy: { type: String },
  modifiedOn: { type: Date },
  modifiedBy: { type: String },
})

export const Blog = mongoose.model("Blog", blogSchema)