import jwt from "jsonwebtoken";

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("JWT_SECRET is not configuring");
    }

    return jwt.sign(
        {userId},
        secret,
        {expiresIn : "1d"}
    );
};

export default generateToken;