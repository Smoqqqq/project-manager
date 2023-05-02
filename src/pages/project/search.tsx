import { PrismaClient } from "@prisma/client";
import Project from "@/types/Project";
import ProjectPreview from "@/component/project/preview";
import Link from "next/link";

interface SearchProjectProps {
    projects: Project[];
}

export default function searchProjects({ projects }: SearchProjectProps) {
    return (
        <>
            <Link href="/project/create" className="btn">
                Nouveau
            </Link>
            <div id="project-preview-row">
                {projects.map((project) => {
                    return (
                        <ProjectPreview
                            project={project}
                            key={project.id}
                        ></ProjectPreview>
                    );
                })}
            </div>
        </>
    );
}

export async function getServerSideProps() {
    const prisma = new PrismaClient();

    const result = await prisma.project.findMany({
        include: {
            author: true,
        },
    });

    let projects: Project[] = [];

    result.forEach((project) => {
        let p = {
            id: project.id,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt.toISOString(),
            author: project.author,
        };
        projects.push(p);
    });

    return {
        props: {
            projects: projects,
        },
    };
}
