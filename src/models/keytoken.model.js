'use strict';

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';


// Declare the Schema of the Mongo model
var userSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref : 'Shop'
    },
    publicKey:{
        type:String,
        required:true
    },
    privateKey:{
        type:String,
        required:false
    },
    refreshTokens: {
        type: [
            {
                tokenHash: { type: String, required: true },
                device: { type: String },
                createdAt: { type: Date, default: Date.now },
                expiresAt: { type: Date },
                revoked: { type: Boolean, default: false }
            }
        ],
        default: []
    }
}, {
    timestamps:true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);