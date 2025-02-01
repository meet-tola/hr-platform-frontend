import { NextFunction, Request, Response } from "express";
import { config } from "../config/app.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import passport from "passport";

export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response) => {
      const currentWorkspace = req.user?.currentWorkspace;
  
      if (!currentWorkspace) {
        return res.redirect(
          `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
        );
      }
  
      return res.redirect(
        `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
      );
    }
  );