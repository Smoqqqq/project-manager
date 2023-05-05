import Project from "@/types/Project";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface CreateTaskFormProps {
    project: Project;
    addTask: Function;
    removeTaskForm: Function;
}

export default function CreateTaskForm({
    project,
    addTask,
    removeTaskForm
}: CreateTaskFormProps) {
    const form = useForm();
    const { register } = form;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const { name, description, startDate, duration } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/project/task/create");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            console.log(response);

            if (response.success) {
                toast.success("The task has been added to the project !");

                let task = response.result;

                addTask(task);
                removeTaskForm();
            } else {
                toast.error(response.message);
            }
        };

        console.log(project);

        request.send(
            `name=${name}&description=${description}&startDate=${startDate}&duration=${duration}&projectId=${project.id}`
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" {...register("name")} />
            <label>Description</label>
            <textarea {...register("description")}></textarea>
            <label>Start date</label>
            <input type="date" {...register("startDate")} />
            <label>Duration</label>
            <input type="number" {...register("duration")} />

            <div className="flex-between">
                <button className="btn btn-secondary mt-5" onClick={ () => { removeTaskForm() } }>Cancel</button>
                <button className="btn mt-5">Add task</button>
            </div>
        </form>
    );
}
