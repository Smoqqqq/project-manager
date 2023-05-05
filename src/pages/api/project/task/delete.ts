// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function deleteTask(
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

    if (!req.body.taskId) {
        return res.status(405).json({
            success: false,
            message: "Please provide a name and project for the task",
        });
    }

    const prisma = new PrismaClient();

    try {
        await prisma.task.delete({
            where: {
                id: Number(req.body.taskId),
            },
        });

        return res.json({
            success: true,
            message: "Task deleted",
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "Could not delete task, please try again later",
        });
    }
}
