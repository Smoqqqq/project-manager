import { PrismaClient } from "@prisma/client";
import Project from "@/types/Project";
import ProjectPreview from "@/component/project/preview";
import Link from "next/link";
import { useState } from "react";

interface SearchProjectProps {
    projects: Project[];
}

export default function SearchProjects({ projects: p }: SearchProjectProps) {
    let [projects, setProjects] = useState(p);

    function removeProject(project: Project) {
        setProjects((projects) => projects.filter((p) => p.id !== project.id));
    }

    return (
        <>
            <Link href="/project/create" className="btn">
                Nouveau
            </Link>
            <div id="project-preview-row">
                {projects.map((project) => {
                    return (
                        <ProjectPreview
                            removeProject={removeProject}
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
            tasks: [],
        };
        projects.push(p);
    });

    return {
        props: {
            projects: projects,
        },
    };
}
