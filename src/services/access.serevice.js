"use strict";
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

            console.log('111111111111111');
            

            if (holderShop) {
                return {
                    code : '400',
                    message : 'Shop already exists',
                    status : 'failed'
                }
            }
            // step 2 hash password
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: passwordHash, roles : [roles.SHOP] });

            if (newShop) {
                // create private key and public key
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                });

                console.log({privateKey, publicKey }); // save collection keystore

                

                const publicKeyString = await require('./keyToken.service').createKeyToken({
                    userId: newShop._id,
                    publicKey
                });

                if (!publicKeyString) {
                    return {
                        code: '500',
                        message: 'Error creating publicKey',
                        status: 'failed'
                    }
                }

                // created token paid
                const publicKeyObject = crypto.createPublicKey(publicKeyString);
                const tokens = await require('../auth/authUtils').createTokenPaid(
                    {
                        userId: newShop._id,
                        email: newShop.email
                    },
                    publicKeyObject,
                    privateKey
                );

                console.log('Created Token Success::', tokens);

                return { code: '201',
                    message: 'Shop created',
                    status: 'success',
                    shop: newShop,
                    tokens
                }
            }
        } catch (error) {
            return {
                code : '500',
                message : error.message,
                status : 'failed'
            }
        }
    }
}
module.exports = AccessService;