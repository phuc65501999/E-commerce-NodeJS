'use strict';

const JWT = require('jsonwebtoken');
const crypto = require('crypto');

// Note: access tokens are signed with `privateKey` (used as HMAC secret here).

const createTokenPaid = async (payload, publicKey, privateKey) => {
    // create token

    try {
        // access token 
        // sign access token using privateKey as secret (HS256)
        const accessToken = JWT.sign(payload, privateKey, {
            expiresIn: '2h'
        });

        // create opaque refresh token (random string)
        const refreshToken = crypto.randomBytes(64).toString('hex');

        return { accessToken, refreshToken };
    } catch (error) {
        console.log('createTokenPaid error:', error);
        throw error;
        
    }
}
const verifyAccessToken = async (token, privateKey) => {
    try {
        const decoded = JWT.verify(token, privateKey);
        return decoded;
    } catch (error) {
        return null;
    }
}

const createAccessToken = (payload, privateKey) => {
    return JWT.sign(payload, privateKey, { expiresIn: '2h' });
}

module.exports = {
    createTokenPaid,
    verifyAccessToken,
    createAccessToken
};