'use strict';

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:Boolean,
        required:true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['READ','WRITE','DELETE','SHARE','UPLOAD_FILES']
    },
}, {
    timestamps:true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);