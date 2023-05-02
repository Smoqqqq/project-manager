import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
const bcrypt = require("bcrypt");

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    let prisma = new PrismaClient();

    if (!req.body.email || !req.body.password) {
        res.status(405).json({
            success: false,
            message: "Please provide both email and password",
        });
    }

    let email = req.body.email;
    let password = req.body.password;

    let user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return res.status(405).json({
            success: false,
            message: "User not found"
        })
    }

    bcrypt.compare(req.body.password, user.password, (err: object, valid: boolean) => {
        
        if (err) {
            res.status(405).json({
                success: false,
                message: "An error occured. Please try again later."
            })
        }
        
        if (valid) {
            res.json({
                success: true,
                message: "User is logged in",
                user: user
            })
        } else {
            res.status(405).json({
                success: false,
                message: "Invalid credentials"
            })
        }
    })
}
