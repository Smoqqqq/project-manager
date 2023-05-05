import Project from "@/types/Project";
import Task from "@/types/Task";
import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ShortcutHelper from "../ShortcutHelper";

interface EditTaskFormProps {
    task: Task;
    setEdit: Function;
    setTask: Function;
}

export default function EditTaskForm({
    task,
    setEdit,
    setTask,
}: EditTaskFormProps) {
    const form = useForm();
    const { register, setValue } = form;

    useEffect(() => {
        let startDate = task.startDate ? new Date(task.startDate) : false;
        console.log(startDate);

        setValue("name", task.name);
        setValue("description", task.description);
        setValue(
            "startDate",
            startDate
                ? startDate.getFullYear() +
                      "-" +
                      (startDate.getMonth() < 9
                          ? "0" + (startDate.getMonth() + 1)
                          : startDate.getMonth()) +
                      "-" +
                      (startDate.getDate() < 10
                          ? "0" + startDate.getDate()
                          : startDate.getDate())
                : ""
        );
        setValue("duration", task.duration);
    }, []);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const { name, description, startDate, duration } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/project/task/edit");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            console.log(response);

            if (response.success) {
                toast.success("Task updated !");
                setEdit(false);
                setTask(response.result);
            } else {
                toast.error(response.message);
            }
        };

        request.send(
            `name=${name}&description=${description}&startDate=${startDate}&duration=${duration}&taskId=${task.id}`
        );
    }

    return (
        <form onSubmit={handleSubmit} className="card has-shortcut">
            <label>Name</label>
            <input type="text" {...register("name")} />
            <label>Description</label>
            <textarea {...register("description")}></textarea>
            <label>Start date</label>
            <input type="date" {...register("startDate")} />
            <label>Duration in days</label>
            <input type="number" {...register("duration")} />

            <ShortcutHelper
                shortcuts={[
                    {
                        key: "Esc",
                        desc: "Exit editing mode",
                    },
                ]}
            />

            <div className="flex-between">
                <button
                    className="btn btn-secondary mt-5"
                    onClick={() => {
                        setEdit(false);
                    }}
                >
                    Cancel
                </button>
                <button className="btn mt-5">Update task</button>
            </div>
        </form>
    );
}
