import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";

export default async function create(req: NextApiRequest, res: NextApiResponse) {
    let session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
        return res.status(400).json({
            success: false,
            message: "Could not find current user. You need to be logged in."
        })
    }
    
    const prisma = new PrismaClient();

    let users = await prisma.user.findMany({
        where: {
            email: {
                in: req.body.users
            }
        },
        select: {
            id: true
        }
    });

    try {
        await prisma.organisation.create({
            data: {
                creatorId: session.user.id,
                name: req.body.name,
                users: {
                    connect: users
                }
            }
        });

        return res.json({
            success: true
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "Could not create organisation"
        })
    }
}
