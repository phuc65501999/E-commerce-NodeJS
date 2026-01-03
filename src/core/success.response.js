'use strict';

class SuccessResponse {
    constructor(message = 'Success', statusCode = 200, data = {}) {
        this.message = message; 
        this.statusCode = statusCode;
        this.data = data;
    }   
}

module.exports = SuccessResponse;