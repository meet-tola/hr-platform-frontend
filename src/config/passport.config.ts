import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { loginOrCreateAccountService } from "../services/auth.service";

passport.use(
    new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
        passReqToCallback: true,
    },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user is already logged in
                const { email, sub: googleId, picture } = profile._json;
                console.log("profile", profile);
                console.log("email", email);
                if (!googleId) {
                    throw new NotFoundException("Google ID not found");
                }
                const { } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email,
                });
            } catch (error) {
                done(error, false);
            }
        }
    )
);