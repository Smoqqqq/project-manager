import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface CreateSubTaskFormProps {
    taskId: number;
    addSubTask: Function;
}

export default function CreateSubTaskForm({ taskId, addSubTask }: CreateSubTaskFormProps) {
    let form = useForm();
    const { register } = form;

    let [open, setOpen] = useState(false);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        let { name, description, duration } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/project/task/subtask/create");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            if (!response.success) {
                toast.error(response.message);
            } else {
                addSubTask(response.result);
                setOpen(false);
            }
        };

        request.send(
            `name=${name}&description=${description}&duration=${duration}&taskId=${taskId}`
        );
    }

    if (open) {
        return (
            <form onSubmit={handleSubmit} className="sub-task-form">
                <div className="content">
                    <input
                        type="text"
                        {...register("name")}
                        placeholder="Name"
                    />
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

    return (
        <div
            className="btn"
            onClick={() => {
                setOpen(true);
            }}
        >
            Add sub-task +
        </div>
    );
}
