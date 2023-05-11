import { SubTask } from "@prisma/client";
import { FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface EditSubTaskFormProps {
    subTask: SubTask;
    setSubTask: Function;
}

export default function EditSubTaskForm({ subTask, setSubTask }: EditSubTaskFormProps) {
    let form = useForm();
    const { register } = form;

    useEffect(() => {
        form.setValue("name", subTask.name);
        form.setValue("description", subTask.description);
        form.setValue("duration", subTask.duration);
    }, []);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        let { name, description, duration } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/project/task/subtask/edit");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            if (!response.success) {
                toast.error(response.message);
            } else {
                setSubTask(response.result);
            }
        };

        request.send(
            `name=${name}&description=${description}&duration=${duration}&id=${subTask.id}`
        );
    }

    return (
        <form onSubmit={handleSubmit} className="sub-task-form">
            <div className="content">
                <input type="text" {...register("name")} placeholder="Name" />
                <textarea
                    {...register("description")}
                    placeholder="Description"
                ></textarea>
            </div>
            <div className="icon">
                <input
                    type="number"
                    {...register("duration")}
                    placeholder="Number of hours"
                />
                <button className="btn">Save</button>
            </div>
        </form>
    );
}
