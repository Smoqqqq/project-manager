import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
const bcrypt = require("bcrypt");

export default async function register(
    req: NextApiRequest,
    res: NextApiResponse
) {
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
        return;
    }

    await bcrypt.genSalt(10).then(async (salt: string) => {
        await bcrypt.hash(req.body.password, salt).then(async (password: string) => {
            let userData = {
                email: req.body.email,
                password: password,
                username: req.body.username,
            };

            console.log(userData);

            let prisma = new PrismaClient();

            try {
                await prisma.user.create({
                    data: userData,
                });
            } catch (e) {
                console.log(e);
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    if (e.code == "P2002") {
                        return res.status(500).json({
                            success: false,
                            message:
                                "This email address already is linked to an account.",
                        });
                    }
                } else {
                    return res.status(500).json({
                        success: false,
                        message:
                            "An error occured while creating the user account.",
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: "Your account was created !",
            });
        });
    });
}
