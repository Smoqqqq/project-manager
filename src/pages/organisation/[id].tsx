import UserProfile from "@/component/user/profile";
import { PrismaClient, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";

interface OrganisationProps {
    organisation: {
        name: string;
        creatorId: number;
        users: User[];
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
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let { id } = context.query;

    let prisma = new PrismaClient();

    let organisation = await prisma.organisation.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            users: true,
        },
    });

    return {
        props: {
            organisation: organisation,
        },
    };
}
