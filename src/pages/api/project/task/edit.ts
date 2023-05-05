// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function edit(req: NextApiRequest, res: NextApiResponse) {
    let session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
        res.status(401).json({
            success: false,
            message: "You must be logged in.",
        });
        return;
    }

    if (!req.body.taskId) {
        return res.status(405).json({
            success: false,
            message: "Please provide a taskId",
        });
    }

    const prisma = new PrismaClient();

    let task = {
        name: req.body.name,
        description: req.body.description,
        duration: req.body.duration ? Number(req.body.duration) : 0,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
    };

    try {
        let result = await prisma.task.update({
            data: task,
            where: {
                id: Number(req.body.taskId),
            },
        });
        res.json({
            success: true,
            message: "Task updated !",
            result: result,
        });
    } catch (e) {
        res.status(503).json({
            success: false,
            message: "An error occured, please try again later",
        });
        console.log(e);
    }
}
