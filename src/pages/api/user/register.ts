import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
const bcrypt = require("bcrypt");

export default function register(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);

    if (!req.body.password || !req.body.email || !req.body.username) {
        res.json({
            success: false,
            message: "Please provide email, username and password",
            provided: {
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
            },
            req: req.body,
        });
    }

    bcrypt.genSalt(10).then((salt: string) => {
        return bcrypt
            .hash(req.body.password, salt)
            .then(async (password: string) => {
                let userData = {
                    email: req.body.email,
                    password: password,
                    username: req.body.username,
                };

                let prisma = new PrismaClient();

                try {
                    let user = await prisma.user.create({
                        data: userData,
                    });

                    return res.status(200).json({
                        success: true,
                        user: user,
                    });
                } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError) {
                        if (e.code === "P2002") {
                            return res.json({
                                success: false,
                                message:
                                    "This email address already is linked to an account.",
                            });
                        }
                    } else {
                        return res.json({
                            success: false,
                            message:
                                "An error occured while creating the user account.",
                        });
                    }
                }
            });
    });

    return res.json({
        success: true,
        message: "Your account was created !",
    });
}
