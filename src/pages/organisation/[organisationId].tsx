import ProjectGrid from "@/component/project/grid";
import UserProfile from "@/component/user/profile";
import Project from "@/types/Project";
import { PrismaClient, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

interface OrganisationProps {
    organisation: {
        id: number;
        name: string;
        creatorId: number;
        users: User[];
        projects: Project[]
    };
}

export default function read({ organisation }: OrganisationProps) {
    return (
        <div className="organisation">
            <h1>{organisation.name}</h1>

            <div id="users-grid">
                {organisation.users.map((user) => {
                    return <UserProfile user={user} key={user.id} />;
                })}
            </div>

            <Link href={"/project/create?organisation=" + organisation.id} className="btn">
                Nouveau
            </Link>
            <ProjectGrid projects={organisation.projects} />
        </div>
    );
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
            projects: true
        },
    });

    return {
        props: {
            organisation: organisation,
        },
    };
}
