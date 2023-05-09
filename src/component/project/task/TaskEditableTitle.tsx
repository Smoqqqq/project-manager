import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { JsxElement } from "typescript";

interface TaskTitle {
    title: string | null;
    dateInterval: ReactNode;
    taskId: number;
}

export default function TaskEditableTitle({ title, dateInterval, taskId }: TaskTitle) {
    let [edit, setEdit] = useState(false);

    let form = useForm();
    const { register } = form;

    useEffect(() => {
        form.setValue("title", title);

        window.addEventListener("keydown", (e) => {
            if (e.code === "Enter") {
                handleEscape();
            }
        });

        return () => {
            window.removeEventListener("keydown", (e) => {
                if (e.code === "Enter") {
                    handleEscape();
                }
            });
        };
    }, []);

    function handleEscape() {
        let request = new XMLHttpRequest();

        request.open("POST", "/api/project/task/edit-name");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            if (!response.success) {
                toast.error(response.message);
            }
        };

        request.send(`taskId=${taskId}&name=${title}`);

        setEdit(false);
    }

    if (edit) {
        return (
            <h1
                onDoubleClick={() => {
                    setEdit(true);
                }}
            >
                <input type="text" {...register("title")} />
                <div className="task-date">{dateInterval}</div>
            </h1>
        );
    }

    return (
        <h1
            onDoubleClick={() => {
                setEdit(true);
            }}
        >
            {title ? title : "..."}
            <div className="task-date">{dateInterval}</div>
        </h1>
    );
}
