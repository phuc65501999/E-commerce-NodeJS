"use strict";
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {BadRequestError} = require('../core/error.response');

const SuccessResponse = require('../core/success.response');   

const roles = {
    SHOP : 'SHOP',
    WRITER : 'WRITER',
    EDITOR : 'EDITOR',
    ADMIN : 'ADMIN'
};
class AccessService {

    static signUp = async ({name, email, password}) => {
        try {
            // step 1 check if user already exists
            const holderShop = await shopModel.findOne({ email }).lean();     

            if (holderShop) {
                // return {
                //     code : '400',
                //     message : 'Shop already exists',
                //     status : 'failed'
                // }
                throw new BadRequestError('Shop already exists');
            }
            // step 2 hash password
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: passwordHash, roles : [roles.SHOP] });

            if (newShop) {
                // create private key and public key
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'spki',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs8',
                //         format: 'pem'
                //     }
                // });

                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');

                const ketStore = await require('./keyToken.service').createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!ketStore) {
                    // return {
                    //     code: '500',
                    //     message: 'Error creating publicKey',
                    //     status: 'failed'
                    // }

                    throw new BadRequestError('creating publicKey error');
                }

                // created token paid
                const tokens = await require('../auth/authUtils').createTokenPaid(
                    {
                        userId: newShop._id,
                        email: newShop.email
                    },
                    publicKey,
                    privateKey
                );

                // store hashed refresh token in keystore
                try {
                    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
                    await require('./keyToken.service').saveRefreshToken({
                        userId: newShop._id,
                        refreshToken: tokens.refreshToken,
                        expiresAt,
                        device: 'signup'
                    });
                } catch (err) {
                    console.log('saveRefreshToken error', err);
                }

                // return SuccessResponse({
                //     code: '201',
                //     message: 'Shop created',
                //     status: 'success',
                //     shop: newShop,
                //     tokens
                // });

                return {
                    code: '201',
                    message: 'Shop created',
                    status: 'success',
                    shop: newShop,
                    tokens
                };
            }
        } catch (error) {
            throw new BadRequestError(error.message);
            // return {
            //     code : '500',
            //     message : error.message,
            //     status : 'failed'
            //
        }
    }

    static login = async ({ email, password }) => {
        const foundShop = await shopModel.findOne({ email }).lean();
        if (!foundShop) {
            throw new BadRequestError('Shop not registered');
        }

        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new BadRequestError('Authentication failed. Wrong password.');
        }

        // Generate RSA key pair for this login session
        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const tokens = await require('../auth/authUtils').createTokenPaid(
            {
                userId: foundShop._id,
                email: foundShop.email
            },
            publicKey,
            privateKey
        );

        await require('./keyToken.service').createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });

        return {
            code: '200',
            message: 'Login successful',
            status: 'success',
            shop: foundShop,
            tokens
        }
    }

    static logout = async ({ userId, refreshToken }) => {
        // remove refresh token in keystore
        await require('./keyToken.service').removeRefreshToken({ userId, refreshToken });
        return {
            code: '200',
            message: 'Logout successful',
            status: 'success'
        };
    }
}

// refresh token flow
AccessService.refreshToken = async ({ userId, refreshToken }) => {
    try {
        const KeyTokenService = require('./keyToken.service');
        const KeyTokenModel = require('../models/keytoken.model');
        const authUtils = require('../auth/authUtils');

        // verify that refresh token exists and valid
        const valid = await KeyTokenService.verifyRefreshToken({ userId, refreshToken });
        if (!valid) {
            // return { code: '403', message: 'Invalid refresh token', status: 'failed' };
            throw new BadRequestError('Invalid refresh token');
        }

        // load privateKey to sign new access token
        const keyDoc = await KeyTokenModel.findOne({ user: userId }).lean();
        if (!keyDoc || !keyDoc.privateKey) {
            // return { code: '500', message: 'Signing key not found', status: 'failed' };
            throw new BadRequestError('Signing key not found');
        }

        const payload = { userId, email: keyDoc.email };

        // create new pair (access + refresh)
        const tokens = await authUtils.createTokenPaid(payload, keyDoc.publicKey, keyDoc.privateKey);

        // save new refresh token and remove old one (rotation)
        try {
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await KeyTokenService.saveRefreshToken({ userId, refreshToken: tokens.refreshToken, expiresAt, device: 'refresh' });
            await KeyTokenService.removeRefreshToken({ userId, refreshToken });
        } catch (err) {
            console.log('rotation error', err);
        }

        // return { code: '200', status: 'success', tokens };
        return SuccessResponse({ code: '200', status: 'success', tokens });
    } catch (error) {
        // return { code: '500', message: error.message, status: 'failed' };
        throw new BadRequestError(error.message);
    }
}

module.exports = AccessService;