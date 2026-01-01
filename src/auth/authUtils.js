'use strict';

const JWT = require('jsonwebtoken');

const createTokenPaid = async (payload, publicKey, privateKey) => {
    // create token

    try {
        // access token 
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2h'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error verify:: ', err);
            } else {
                console.log('decode verify:: ', decode);
            }
        });

        return { accessToken, refreshToken  };
    } catch (error) {
        
    }
}

module.exports = {
    createTokenPaid
};