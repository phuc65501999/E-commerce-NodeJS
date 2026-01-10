const AccessService = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        try {
            console.log('Sign-up request received', req.body);

            return res.status(201).json(await AccessService.signUp(req.body));
        } catch (error) {
            next(error);
        }
    }

    refresh = async (req, res, next) => {
        try {

            return res.status(200).json(await AccessService.refreshToken({ 
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
             }));
        } catch (error) {
            next(error);
        }
    }

    login = async (req, res, next) => {
        try {
            console.log('Login request received', req.body);
            return res.status(200).json(await AccessService.login(req.body));
        } catch (error) {
            next(error);
        }
    }

    logout = async (req, res, next) => {
        try {
            const userId = req.headers['x-client-id'];
            const refreshToken = req.headers['authorization'];
            return res.status(200).json(await AccessService.logout({ userId, refreshToken }));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccessController();