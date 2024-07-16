import * as mongoose from 'mongoose'


export interface BlogDocument extends mongoose.Document{
  title?: string;
  introduction?: string;
  content1?: string;
  content2?: string;
  content3?: string;
  tags?: any[];

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const blogSchema = new mongoose.Schema({
  title: {type: String},
  introduction: {type: String},
  content1:{type: String},
  content2: {type: String},
  content3: {type: String},
  tags: [String],
  icon: {type: String},
  photo: {type: String},
 
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const Blog = mongoose.model("Blog", blogSchema)