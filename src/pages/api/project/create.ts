// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function create(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
        res.status(401).json({
            success: false,
            message: "You must be logged in.",
            session: session,
            user: session?.user,
            email: session?.user?.email,
        });
        return;
    }

    if (!req.body.organisationId) {
        res.status(500).json({
            success: false,
            message: "No `organisationId` provided",
        });
        return;
    }

    const prisma = new PrismaClient();

    let user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    let project = {
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date(),
        author: {
            connect: {
                id: user?.id,
            },
        },
        organisation: {
            connect: {
                id: Number(req.body.organisationId),
            }
        }
    };

    try {
        let result = await prisma.project.create({
            data: project,
        });
        res.json({
            success: true,
            message: "Project created !",
            result: result,
        });
    } catch (e) {
        console.log(e);

        res.status(405).json({
            success: false,
            message: "An error occured, please try again later",
        });
    }
}
