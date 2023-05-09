import Project from "@/types/Project";
import ProjectPreview from "./preview";
import { useState } from "react";

export default function ProjectGrid({ projects: p }: { projects: Project[] }) {

    let [projects, setProjects] = useState(p);

    function removeProject(project: Project) {
        setProjects((projects) => projects.filter((p) => p.id !== project.id));
    }
    
    return (
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
    );
}
