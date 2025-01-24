import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
    console.error(`Error Occured on PATH ${req.path}`, error);
    if (error instanceof Error) {
        return res.status(400).json(
            {
                message: error.message || "Invalid JSON format. Please check your request body and try again",
            });
    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json(
        {
        message: "Something went wrong",
        error: error?.message || "Unknown error occurred"
    });
};