"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        next(err);
    });
};
exports.catchAsync = catchAsync;
