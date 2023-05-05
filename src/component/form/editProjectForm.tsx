import Project from "@/types/Project";
import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ShortcutHelper from "../ShortcutHelper";

interface EditProjectProps {
    project: Project;
    setEdit: Function;
    setProject: Function;
}

export default function EditProjectForm({
    project,
    setEdit,
    setProject,
}: EditProjectProps) {
    let form = useForm();

    let { register, setValue } = form;

    useEffect(() => {
        setValue("name", project.name);
        setValue("description", project.description);
    }, []);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        let { name, description } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/project/edit");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            console.log(response);

            if (response.success) {
                toast.success("Your project has been updated !");

                project.name = name;
                project.description = description;

                setEdit(false);
                setProject(project);
            } else {
                toast.error(response.message);
            }
        };

        request.send(
            `name=${name}&description=${description}&projectId=${project.id}`
        );
    }

    return (
        <form onSubmit={handleSubmit} className="has-shortcut">
            <ShortcutHelper
                shortcuts={[
                    {
                        key: "Esc",
                        desc: "Exit editing mode",
                    },
                ]}
            />

            <label>Name *</label>
            <input {...register("name")} type="text" />

            <label>Description</label>
            <textarea {...register("description")}></textarea>

            <div className="flex-between">
                <button
                    className="btn btn-secondary mt-5"
                    onClick={() => {
                        setEdit(false);
                    }}
                >
                    Cancel
                </button>
                <button className="btn mt-5">Update</button>
            </div>
        </form>
    );
}
