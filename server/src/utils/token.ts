import { ILoginTokenPayload } from "../types/user";
import Jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const tokenSecretKey: string = process.env.JWT_KEY as string;

export const createToken = (payload: ILoginTokenPayload,  options: { expiresIn: string }): string => {
    const token = Jwt.sign(payload, tokenSecretKey , options)
    return token;
}

export const verifyToken = (token: string): false | JwtPayload => {
    let validationResult: false | JwtPayload = false;

    Jwt.verify(token, tokenSecretKey, function(err, decoded): void {
        if (err) {
            return;
        } else {
            validationResult = decoded as JwtPayload;
        }
    })

    return validationResult;
}

module.exports = {
    createToken,
    verifyToken
}