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

    if (!req.body.id || !req.body.position) {
        return res.status(405).json({
            success: false,
            message: "Please provide a subTask id and position",
        });
    }

    const prisma = new PrismaClient();

    try {
        let subTask = await prisma.subTask.update({
            data: {
                position: Number(req.body.position)
            },
            where: {
                id: Number(req.body.id)
            }
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
