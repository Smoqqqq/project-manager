import Project from "@/types/Project";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface ProjectPreviewProps {
    project: Project;
    removeProject: Function;
}

export default function ProjectPreview({ project, removeProject }: ProjectPreviewProps) {

    let [confirm, setConfirm] = useState(false);

    function handleDelete() {
        let request = new XMLHttpRequest();
        request.open("GET", "/api/project/delete?projectId=" + project.id);

        request.onload = () => {
            console.log(request.response)
            let response = JSON.parse(request.response);

            if (response.success) {
                toast.success("Project deleted !");
                removeProject(project)
            } else {
                toast.error(response.message);
            }
        };

        request.send();
    }

    if(confirm) {
        return (
            <div className="project-preview">
                <h3>Are you sure you wan&apos;t to delete this project ?</h3>
                <p>This action <b>CANNOT BE UNDONE</b></p>
                <span onClick={() => { setConfirm(false) }} className="btn btn-sm btn-primary">Cancel</span>
                <span className="btn btn-sm btn-danger ml-2" onClick={handleDelete}>Yes, i&apos;m sure</span>
            </div>
        )
    }

    return (
        <div className="project-preview">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <small>
                Created by :{" "}
                {project.author.username
                    ? project.author.username
                    : project.author.email}
            </small>
            <br />
            <br />

            <Link href={"/project/" + project.id} className="btn btn-sm">
                See more +
            </Link>
            <div onClick={() => { setConfirm(true) }} className="btn btn-sm btn-danger ml-2" style={{ display: "inline"}}>Delete</div>
        </div>
    );
}
