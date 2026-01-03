'use strict';

class KeyTokenService {
    // create or update publicKey, privateKey

    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try {
            const keyToken = await require('../models/keytoken.model').create({
                user: userId,
                publicKey: publicKey.toString(),
                privateKey: privateKey ? privateKey.toString() : undefined
            });
            return keyToken ? keyToken.publicKey : null;
        } catch (error) {
            console.log(error);
            return error;
        }
    }  
    
    static saveRefreshToken = async ({ userId, refreshToken, expiresAt = null, device = null }) => {
        try {
            const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            const refreshEntry = { tokenHash, device, createdAt: new Date(), expiresAt };
            const doc = await KeyTokenModel.findOneAndUpdate(
                { user: userId },
                { $push: { refreshTokens: refreshEntry } },
                { new: true, upsert: true }
            ).lean();
            return doc;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static verifyRefreshToken = async ({ userId, refreshToken }) => {
        try {
            const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            const now = new Date();
            const doc = await KeyTokenModel.findOne({
                user: userId,
                refreshTokens: {
                    $elemMatch: {
                        tokenHash,
                        revoked: false,
                        $or: [ { expiresAt: null }, { expiresAt: { $gt: now } } ]
                    }
                }
            }).lean();
            return !!doc;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static removeRefreshToken = async ({ userId, refreshToken }) => {
        try {
            const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            const doc = await KeyTokenModel.findOneAndUpdate(
                { user: userId },
                { $pull: { refreshTokens: { tokenHash } } },
                { new: true }
            );
            return doc;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
} 

module.exports = KeyTokenService;