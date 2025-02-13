import passport from "passport";
import { Strategy as GoogleStartegy } from "passport-google-oauth20";
import  Jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { Prisma } from "./lib/prismaClient";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

export function initPassport() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw new Error("google env variables are missing");
  }

  passport.use(
    new GoogleStartegy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ["email", "profile"],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) => {
        const token = Jwt.sign({id : profile.id, name : profile.displayName, email : profile.emails[0].value},process.env.JWT_SECRET!);
        console.log("token", token);

        try {
            const user = Prisma.user.upsert({
                create :{
                    profileId : profile.id,
                    name : profile.displayName,
                    email : profile.emails[0].value
                },
                update:{
                    name : profile.displayName
                },
                where:{
                  email : profile.emails[0].value
                }
            })
            done(null,user)
        } catch (error) {
           done(error,null);
        }
      }
    )
  );
}
