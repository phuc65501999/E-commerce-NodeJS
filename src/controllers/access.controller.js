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
            const { userId, refreshToken } = req.body;
            return res.status(200).json(await AccessService.refreshToken({ userId, refreshToken }));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccessController();