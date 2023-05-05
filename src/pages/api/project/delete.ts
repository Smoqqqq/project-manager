import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
export default async function deleteProject(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.projectId) {
        return res.status(400).json({
            success: false,
            message: "Please provide a project id",
        });
    }

    let prisma = new PrismaClient();

    try {
        await prisma.project.delete({
            where: {
                id: Number(req.query.projectId),
            },
        });

        return res.json({
            success: true,
            message: "Project deleted !",
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Could not delete project, please try again later.",
        });
    }
}
