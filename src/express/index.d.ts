import express from "src/express";

declare global {
    namespace Express {
        interface Request {
            user?: any,
            _parsedUrl?: any,
            roles: any
        }
    }
}