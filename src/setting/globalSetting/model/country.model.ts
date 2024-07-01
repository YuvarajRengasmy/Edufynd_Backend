import * as mongoose from 'mongoose'
// const { Schema } = mongoose;

export interface CountryDocument extends mongoose.Document{
    country?: any[];
  

    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const countrySchema = new mongoose.Schema({
    country: [String],


    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
 
})

// const countryItemSchema = new Schema({
//     _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Generate a unique ID for each country
//     name: { type: String, required: true }
//   });
  
//   // Define the main schema
//   const countrySchema = new Schema({
//     countries: [countryItemSchema]
//   });

export const Country = mongoose.model("Country", countrySchema)