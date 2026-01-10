'use strict';

const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const asyncHandler = require('../helpers/asyncHandler');
const KeyTokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization',
    CLIENT_ID : 'x-client-id'
}

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
        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7d'
        });

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

const verifyRefreshToken = async (token, privateKey) => {
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

const authentication = asyncHandler(async (req, res, next) => {
    try {
        const rawClientId = req.headers[HEADER.CLIENT_ID];
        if (!rawClientId) {
            return res.status(401).json({ message: 'Client Id header missing' });
        }
        const userId = String(rawClientId).trim();
        if (!Types.ObjectId.isValid(userId)) {
            console.log('Authentication: invalid client id:', userId);
            return res.status(400).json({ message: 'Invalid Client Id' });
        }
        // Here you would typically retrieve the user's privateKey from your database
        const keyDoc = await KeyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
        if (!keyDoc || !keyDoc.publicKey) {
            return res.status(401).json({ message: 'Signing key not found' });
        }
        let token = req.headers[HEADER.AUTHORIZATION];
        if (!token) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        if (typeof token === 'string' && token.toLowerCase().startsWith('bearer ')) {
            token = token.slice(7).trim();
        }
            const decoded = await verifyAccessToken(token, keyDoc.privateKey);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {
    createTokenPaid,
    verifyAccessToken,
    createAccessToken,
    authentication,
    verifyRefreshToken
};