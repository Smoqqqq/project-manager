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
    lowestTaskDate: number;
}

export default function ProjectTask({
    task: t,
    deleteTask,
    scale,
    lowestTaskDate,
}: ProjectTaskProps) {
    let [deletionModal, setDeletionModal] = useState(<div></div>);
    let [edit, setEdit] = useState(false);
    let [task, setTask] = useState(t);
    let [mouseDown, setMouseDown] = useState(false);
    // let [currentX, setCurrentX] = useState(0);
    const taskRef: RefObject<HTMLDivElement> = createRef();
    const router = useRouter();

    let [left, setLeft] = useState(0);

    let isOpen =
        router.query.params && Number(router.query.params[1]) === task.id
            ? true
            : false;
    let [open, setOpen] = useState(isOpen);

    let duration = task.duration ? task.duration : false;
    let width = duration ? scale * duration : scale;
    let startDate = getStartDate();

    useEffect(() => {
        calculateLeftX();
    }, [scale]);

    useEffect(() => {
        window.addEventListener("exit-modal", handleEscape);

        window.addEventListener("timeline-mouse-up", () => {
            handleMouseUp();
        });

        return () => {
            window.removeEventListener("timeline-mouse-up", () => {
                handleMouseUp();
            });
            window.removeEventListener("exit-modal", handleEscape);
        };
    }, []);

    function calculateLeftX() {
        let diffDays = 0;

        if (task.startDate) {
            const diffTime = Math.abs(task.startDate - lowestTaskDate);
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        const leftX = diffDays * scale;

        console.log(diffDays, new Date(lowestTaskDate).toISOString(), new Date(task.startDate).toISOString())

        if (taskRef.current) {
            taskRef.current.style.transform = `translateX(${leftX}px)`;
        }
        setLeft(leftX);
    }

    function createAskForDeletionModal() {
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
        calculateLeftX();
        setEdit(value);
    }

    function getStartDate(): JSX.Element {
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
                    <FontAwesomeIcon icon={faClock}></FontAwesomeIcon> starting
                    on {dateString}
                    {task.duration ? " | " + task.duration + " days" : ""}
                </>
            );
        }

        return startDate;
    }

    function handleEscape() {
        setEdit(false);
    }

    function handleMouseDown() {
        setMouseDown(true);
    }

    function handleMouseUp() {
        calculateLeftX();
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
                        onClick={createAskForDeletionModal}
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
