"use strict";

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

const apiKeyService = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
    console.log('req. ', req.headers);
    
    try {
        const rawKey = req.headers[HEADER.API_KEY] || req.headers[HEADER.API_KEY.toLowerCase()];
        const key = (rawKey || '').toString().replace(/^['\"]|['\"]$/g, '').trim();
        if (!key) {
            return res.status(403).json({
                code : 403,
                message : 'Forbidden Error. Missing API Key',
                status : 'failed'
            });
        }
        // check objkey
        const objKey = await apiKeyService.findById(key);
        if (!objKey){
            return res.status(403).json({
                code : 403,
                message : 'Forbidden Error. Invalid API Key',
                status : 'failed'
            });
        }

        req.objKey = objKey;
        next();
    } catch (error) {
        next(error);
    }
}

const checkPermission = (permission) => {
    return (req, res, next) => {
        try {
            const objKey = req.objKey;
            console.log('objKey: ', objKey);
            console.log('permission: ', permission);
            console.log('condition : ', objKey.permissions.includes(permission));
            
            if (objKey && Array.isArray(objKey.permissions) && objKey.permissions.includes(permission)){
                return next();
            }
            return res.status(403).json({
                code : 403,
                message : 'Forbidden Error. You do not have permission to access this resource',
                status : 'failed'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {apiKey, HEADER, checkPermission};