import Task from "@/types/Task";
import { faClock, faPenAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, RefObject, createRef, useEffect, useState } from "react";
import EditTaskForm from "../form/editTaskForm";
import OpenTask from "./openTask";
import { useRouter } from "next/router";

interface ProjectTaskProps {
    task: Task;
    deleteTask: Function;
    scale: number;
    lowestTaskDate: number | undefined;
    setDragOff: Function;
}

export default function ProjectTask({
    task: t,
    deleteTask,
    scale,
    lowestTaskDate,
    setDragOff,
}: ProjectTaskProps) {
    let [deletionModal, setDeletionModal] = useState(<div></div>);
    let [edit, setEdit] = useState(false);
    let [task, setTask] = useState(t);
    let [mouseDown, setMouseDown] = useState(false);
    // let [currentX, setCurrentX] = useState(0);
    const taskRef: RefObject<HTMLDivElement> = createRef();
    const router = useRouter();

    useEffect(() => {
        let leftX =
            task.startDate && lowestTaskDate
                ? Math.round(
                      (task.startDate - lowestTaskDate) / (1000 * 60 * 60 * 24)
                  ) * scale
                : 0;
        setLeft(leftX);
    }, [scale]);

    let isOpen =
        router &&
        router.query &&
        router.query.params &&
        Number(router.query.params[1]) === task.id
            ? true
            : false;
    let [open, setOpen] = useState(isOpen);

    let duration = task.duration ? task.duration : false;
    let leftX =
        task.startDate && lowestTaskDate
            ? Math.round(
                  (task.startDate - lowestTaskDate) / (1000 * 60 * 60 * 24)
              ) * scale
            : 0;
    let [left, setLeft] = useState(leftX);
    let width = duration ? scale * duration : "fit-content";

    function askForDeletion() {
        setDeletionModal(
            <div className="deletion-modal">
                <p>Are you sure you want to delete this task ?</p>
                <div className="flex-between">
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            deleteTask(task);
                        }}
                    >
                        Confirm deletion
                    </button>
                    <button
                        className="btn btn-sm"
                        onClick={() => {
                            setDeletionModal(<div></div>);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    function stopEdit(value = false) {
        let leftX =
            task.startDate && lowestTaskDate
                ? Math.round(
                      (task.startDate - lowestTaskDate) / (1000 * 60 * 60 * 24)
                  ) * scale
                : 0;
        setLeft(leftX);
        setEdit(value);
    }

    useEffect(() => {
        if (taskRef.current) {
            taskRef.current.style.transform = `translateX(${left}px)`;
        }
    }, [left]);

    let startDate = <></>;

    if (task.startDate) {
        let date = new Date(task.startDate);
        let days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        let dateString =
            days[date.getDay()] +
            " " +
            date.getDate() +
            "/" +
            date.getMonth() +
            "/" +
            date.getFullYear();
        startDate = (
            <>
                {" "}
                <FontAwesomeIcon icon={faClock}></FontAwesomeIcon> starting on{" "}
                {dateString}
                {task.duration ? " | " + task.duration + " days" : ""}
            </>
        );
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

    function handleMouseDown() {
        setDragOff(false);
        setMouseDown(true);
    }

    /**
     * left: 200
     * scale: 250
     * 
     * closest: 150
     * 
     * NEW left = 
     */

    function handleMouseUp() {
        let x = Math.round(left / scale) * scale;
        console.log(left, scale, x)
        // // setCurrentX(0)
        setLeft(x)
        setMouseDown(false);
    }

    function handleMouseMove(e: MouseEvent) {
        if (e.movementX && mouseDown) {
            setLeft(left + e.movementX);
        }
    }

    function close() {
        router.push(location.href.replace("/task/" + task.id, ""));
        setOpen(false);
    }

    if (edit) {
        return (
            <EditTaskForm task={task} setEdit={stopEdit} setTask={setTask} />
        );
    }

    return (
        <>
            <div
                ref={taskRef}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onDoubleClick={() => {
                    router.push(location.href + "/task/" + task.id);
                    setOpen(true);
                }}
                className="project-task has-action"
                style={{
                    left: left + "px",
                    width: width + "px",
                }}
                onMouseLeave={() => {
                    setDeletionModal(<div></div>);
                }}
            >
                <div className="main-task-container">
                    <h3>{task.name}</h3>
                    <small>
                        {task.description}
                        {startDate}
                    </small>
                </div>
                <div className="action-panel">
                    <button
                        className="btn btn-sm btn-warning mr-1"
                        onClick={() => {
                            setEdit(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPenAlt}></FontAwesomeIcon>
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={askForDeletion}
                    >
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </button>
                    {deletionModal}
                </div>
            </div>
            {open ? <OpenTask id={task.id} close={close} /> : ""}
        </>
    );
}
