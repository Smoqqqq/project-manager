// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function edit(
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
            email: session?.user?.email
        });
        return;
    }

    if (!req.body.projectId) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid project ID."
        })
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
    };

    try {
        let result = await prisma.project.update({
            data: project,
            where: {
                id: Number(req.body.projectId)
            }
        });
        res.json({
            success: true,
            message: "Project updated !",
            result: result
        });
    } catch (e) {
        res.status(405).json({
            success: false,
            message: "An error occured, please try again later"
        })
    }
}
