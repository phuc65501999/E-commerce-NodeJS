'use strict';

class KeyTokenService {
    // create or update publicKey, privateKey

    static createKeyToken = async ({userId, publicKey, refeshToken}) => {
        try {
            // const filter = { user: userId };
            // const update = { publicKey, refeshToken };
            // const options = { upsert: true, new: true };
            // const keyToken = await require('../models/keytoken.model').findOneAndUpdate(
            //     filter,
            //     update,
            //     options
            // );

            const publicKeyString  = publicKey.toString();
            const keyToken = await require('../models/keytoken.model').create({
                user: userId,
                publicKey: publicKeyString,
                refeshToken: [refeshToken]
            }); 
            return keyToken ? keyToken.publicKey : null;
        } catch (error) {
            console.log(error);
            return error;
        }
    }  
} 

module.exports = KeyTokenService;