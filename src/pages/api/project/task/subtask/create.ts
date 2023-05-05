// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

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

    if (!req.body.name || !req.body.taskId) {
        return res.status(405).json({
            success: false,
            message: "Please provide a name and taskId",
        });
    }

    let position = 0;
    const prisma = new PrismaClient();

    let highest = await prisma.subTask.findFirst({
        select: {
            position: true
        },
        where: {
            taskId: Number(req.body.taskId)
        },
        orderBy: {
            position: "desc"
        }
    })

    if (highest) {
        position = highest.position;
    }

    let data = {
        name: req.body.name,
        description: req.body.description,
        position: position,
        duration: Number(req.body.duration),
        createdAt: new Date(),
        taskId: Number(req.body.taskId)
    }

    try {
        let subTask = await prisma.subTask.create({
            data: data
        });

        return res.json({
            success: true,
            result: subTask
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "An error occured, please try again later."
        })
    }
}
