'use strict';

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = 'Conflict Request') {
        super(message, 409);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}



module.exports = { ErrorResponse, ConflictRequestError, BadRequestError };
