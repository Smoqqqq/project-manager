// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function create(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
        res.status(401).json({
            success: false,
            message: "You must be logged in.",
        });
        return;
    }

    if (!req.body.name || !req.body.projectId) {
        return res.status(405).json({
            success: false,
            message: "Please provide a name and project for the task",
        });
    }

    const prisma = new PrismaClient();

    let user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
    });

    let task = {
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date(),
        duration: req.body.duration ? Number(req.body.duration) : 0,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        author: {
            connect: {
                id: user?.id,
            },
        },
        project: {
            connect: {
                id: Number(req.body.projectId)
            }
        }
    };

    try {
        let result = await prisma.task.create({
            data: task,
        });
        res.json({
            success: true,
            message: "Task created !",
            result: result,
        });
    } catch (e) {
        res.status(503).json({
            success: false,
            message: "An error occured, please try again later",
        });
        console.log(e)
    }
}
