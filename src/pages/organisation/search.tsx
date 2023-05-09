import { Organisation, PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";

export default function SearchOrganisations(/* { orgs }: Organisation[] */) {
    return (
        <>
            {/* {
                orgs.map((org: Organisation) => {
                    return <div className="card" key={org.id}>{ org.name }</div>;
                })
            } */}
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let session = await getServerSession(context.req, context.res, authOptions);

    console.log(session);

    let prisma = new PrismaClient();

    let orgs = await prisma.organisation.findMany({
        where: {
            users: {
                some: {
                    id: {
                        in: [Number(session?.user?.id)],
                    },
                },
            },
        },
    });

    return {
        props: {}
    }
}
