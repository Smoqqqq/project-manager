import Project from "@/types/Project";

interface ProjectPreviewProps {
    project: Project
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
    return (
        <div className="project-preview">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
        </div>
    );
}
