// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function read(req: NextApiRequest, res: NextApiResponse) {
    let session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.email) {
        res.status(401).json({
            success: false,
            message: "You must be logged in.",
        });
        return;
    }

    if (!req.query.id) {
        return res.status(400).json({
            success: false,
            message: "Please provide the id of the object",
        });
    }

    const prisma = new PrismaClient();

    try {
        let task = await prisma.task.findUnique({
            where: {
                id: Number(req.query.id),
            },
            include: {
                author: true,
                assignedUsers: true,
                subTasks: true,
            }
        });
        
        res.json({
            success: true,
            message: "Task created !",
            result: task,
        });
    } catch (e) {
        res.status(503).json({
            success: false,
            message: "An error occured, please try again later",
        });
        console.log(e);
    }
}
