import Project from "@/types/Project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import EditProjectForm from "../form/editProjectForm";
import { Organisation, User } from "@prisma/client";
import Task from "@/types/Task";

interface ProjectHeaderProps {
    project: {
        id: number;
        name: string;
        description: string | null;
        createdAt: String | Date;
        author: User;
        tasks: Task[];
        organisation: Organisation;
    };
    setProject: Function;
}

export default function ProjectHeader({
    project,
    setProject,
}: ProjectHeaderProps) {
    let [edit, setEdit] = useState(false);

    function editProject() {
        setEdit(true);
    }

    function handleEscape() {
        setEdit(false);
    }

    useEffect(() => {
        window.addEventListener("exit-modal", handleEscape);

        return () => {
            window.removeEventListener("exit-modal", handleEscape);
        };
    });

    if (edit) {
        return (
            <EditProjectForm
                project={project}
                setEdit={setEdit}
                setProject={setProject}
            />
        );
    }

    return (
        <div onDoubleClick={editProject}>
            <div className="flex-between">
                <h1>
                    {project.name} - {project.organisation.name}
                </h1>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={editProject}
                >
                    <FontAwesomeIcon icon={faPenAlt}></FontAwesomeIcon>
                </button>
            </div>
            <p>{project.description}</p>
        </div>
    );
}
