import { PrismaClient, Project } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";
import { OrgInterface, ProjectInterface } from "@/types/Project";

interface OrganisationSearchProps {
    orgs: {
        id: number;
        name: string;
        creatorId: number;
        projects: Project[];
    }[];
}

export default function SearchOrganisations({ orgs }: OrganisationSearchProps) {
    return (
        <>
            {orgs.map((org) => {
                return (
                    <div className="card" key={org.id}>
                        <h4>{org.name}</h4>
                        <hr />
                        {org.projects.map((project) => {
                            return (
                                <Link
                                    href={"/project/" + project.id}
                                    key={project.id}
                                >
                                    {project.name}
                                </Link>
                            );
                        })}

                        <div className="mt-5"></div>
                        <Link href={"/organisation/" + org.id} className="btn">
                            See more
                        </Link>
                    </div>
                );
            })}
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let session = await getServerSession(context.req, context.res, authOptions);

    let prisma = new PrismaClient();

    let organisations = await prisma.organisation.findMany({
        where: {
            users: {
                some: {
                    id: {
                        equals: Number(session?.user?.id),
                    },
                },
            },
        },
        include: {
            projects: true,
            users: true
        },
    });

    let orgs: OrgInterface[] = [];

    for (let i = 0; i < organisations.length; i++) {
        let orga = organisations[i];
        let projects: ProjectInterface[] = [];

        if (orga.projects) {
            for (let j = 0; j < orga.projects.length; j++) {
                let project = orga.projects[j];

                projects.push({
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    createdAt: new Date(project.createdAt).getTime(),
                });
            }
        }

        orgs.push({
            ...orga,
            projects: projects,
        });
    }

    return {
        props: {
            orgs: orgs,
        },
    };
}
