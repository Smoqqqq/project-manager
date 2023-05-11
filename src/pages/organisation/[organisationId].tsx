import ProjectGrid from "@/component/project/grid";
import ProjectPreview from "@/component/project/preview";
import UserProfile from "@/component/user/profile";
import Project from "@/types/Project";
import Task from "@/types/Task";
import { PrismaClient, User, Organisation } from '@prisma/client';
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

interface OrganisationProps {
    organisation: {
        id: number;
        name: string;
        creatorId: number;
        users: User[];
    };
    projects: {
        id: number;
        name: string;
        description: string | null;
        createdAt: string;
        author: User;
        tasks: Task[]
    }[];
}

export default function read({ organisation, projects }: OrganisationProps) {
    return (
        <div className="organisation">
            <h1>{organisation.name}</h1>
            <hr />

            <div id="users-grid" className="mb-5">
                {organisation.users.map((user) => {
                    return <UserProfile user={user} key={user.id} />;
                })}
            </div>

            <Link
                href={"/project/create?organisation=" + organisation.id}
                className="btn"
            >
                Nouveau
            </Link>
            <ProjectGrid projects={projects} />
        </div>
    );
}

function exclude<Project, Key extends keyof Project>(
    project: Project,
    keys: Key[]
): Omit<Project, Key> {
    for (let key of keys) {
        delete project[key];
    }
    return project;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let { organisationId } = context.query;

    let prisma = new PrismaClient();

    let organisation = await prisma.organisation.findUnique({
        where: {
            id: Number(organisationId),
        },
        include: {
            users: true,
        },
    });

    let projects = await prisma.project.findMany({
        include: {
            tasks: true,
            author: true
        },
        where: {
            organisation: {
                id: Number(organisationId)
            }
        }
    })

    let projectList = [];

    for (let j = 0; j < projects.length; j++) {
        let project = projects[j];

        projectList.push({
            ...project,
            createdAt: new Date(project.createdAt).getTime(),
        });
    }

    for (let i = 0; i < projects.length; i++)

    return {
        props: {
            organisation: organisation,
            projects: projectList,
        },
    };
}
