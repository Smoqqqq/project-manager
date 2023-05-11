import { PrismaClient } from "@prisma/client";
import { User, getServerSession } from "next-auth";
import { authOptions } from "./pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

export async function getUser(
    context: GetServerSidePropsContext
): Promise<User | undefined> {
    let session = await getServerSession(context.req, context.res, authOptions);
    return session?.user;
}

export default function isGrantedProject(
    userId: string | number,
    orgaId: string | number
): boolean {
    let prisma = new PrismaClient();

    let user = prisma.user.findFirst({
        where: {
            id: Number(userId),
            organisations: {
                some: {
                    id: Number(orgaId),
                },
            },
        },
    });

    if (null === user) {
        return false;
    }

    return true;
}

export async function redirectIfNull(
    object: any,
    message: string | undefined,
    url: string = "/user/login"
): Promise<object | false> {
    if (object === null) {
        return {
            redirect: {
                permanant: false,
                destination: url + (message ? "?toast=" + btoa(message) : ""),
            },
        };
    }

    return false;
}
