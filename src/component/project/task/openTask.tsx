import {
    faArrowRightArrowLeft,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Ref, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateSubTaskForm from "./subtask/createSubTaskForm";
import { SubTask as SubTaskType } from "@prisma/client";
import SubTask from "./subtask/subtask";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/component/StrictModeDroppable";
import ShortcutHelper from "@/component/ShortcutHelper";

interface TaskProps {
    id: number;
    close: Function;
}

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: object) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    marginLeft: isDragging
        ? -(innerWidth - (innerWidth * 0.9 > 1000 ? 1000 : innerWidth * 0.9)) /
              2 +
          "px"
        : "0px",
    marginTop: isDragging ? "-100px" : "0px",

    // styles we need to apply on draggables
    ...draggableStyle,
});

export default function OpenTask({ id, close }: TaskProps) {
    let [task, setTask] = useState({
        id: 0,
        name: "",
        description: "",
        startDate: new Date().getTime(),
        duration: 1,
        author: {
            id: 0,
            email: "",
            username: "",
        },
        subTasks: [{}],
    });

    let [subTasks, setSubTasks] = useState<SubTaskType[]>([]);

    useEffect(() => {
        let taskRequest = new XMLHttpRequest();

        taskRequest.open("GET", "/api/project/task/read?id=" + id);

        taskRequest.onload = () => {
            let response = JSON.parse(taskRequest.response);

            if (!response.success) {
                console.log(response);
                toast.error(response.message);
                return;
            } else {
                console.log(response.result.subTasks);
                let subTasks = response.result.subTasks.sort(
                    (a: SubTaskType, b: SubTaskType) => {
                        return a.position - b.position;
                    }
                );
                setTask(response.result);
                setSubTasks(subTasks);
            }
        };

        taskRequest.send();
    }, []);

    let startDate = <>Unknown</>;

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
        let startDateString =
            date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

        let endDate = new Date(
            date.setTime(date.getTime() + task.duration * 24 * 60 * 60 * 1000)
        );

        let endDateString =
            endDate.getDate() +
            "/" +
            endDate.getMonth() +
            "/" +
            endDate.getFullYear();

        startDate = (
            <>
                {startDateString}
                <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                {endDateString}
            </>
        );
    }

    function addSubTask(subTask: SubTaskType) {
        setSubTasks([...subTasks, subTask]);
    }

    function onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            subTasks,
            result.source.index,
            result.destination.index
        );

        setSubTasks(items);
        persistOrder(items);
    }

    function persistOrder(items: SubTaskType[]) {
        items.map((task, i) => {
            let request = new XMLHttpRequest();

            request.open("POST", "/api/project/task/subtask/order");
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

            request.send(`id=${task.id}&position=${i}`);
        });
    }

    function handleEscape() {
        close();
    }

    useEffect(() => {
        window.addEventListener("exit-modal", handleEscape);

        return () => {
            window.removeEventListener("exit-modal", handleEscape);
        };
    });

    return (
        <div className="open-task">
            <div
                className="close-task"
                onClick={() => {
                    close();
                }}
            >
                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </div>
            <h1>
                {task ? task.name : "..."}
                <div className="task-date">{startDate}</div>
            </h1>{" "}
            <hr />
            <div className="has-shortcut">
                <ShortcutHelper
                    shortcuts={[
                        {
                            key: "Esc",
                            desc: "Exit task",
                        },
                    ]}
                />
                <b>Created by :</b>
                <p className="mt-1">
                    {task.author.username
                        ? task.author.username
                        : task.author.email}
                </p>
                <b>Description :</b>
                <p className="mt-1">
                    {task.description ? task.description : "-"}
                </p>
                <DragDropContext onDragEnd={onDragEnd}>
                    <StrictModeDroppable droppableId="subTaskList">
                        {(
                            provided: {
                                droppableProps: [];
                                innerRef: Ref<HTMLDivElement>;
                                placeholder: string;
                            },
                            snapshot: {
                                placeholder: string;
                            }
                        ) => (
                            <div
                                style={{
                                    position: "relative",
                                }}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {subTasks.map((subTask, i) => {
                                    return (
                                        <Draggable
                                            key={subTask.id}
                                            draggableId={"subTask" + subTask.id}
                                            index={i}
                                        >
                                            {(
                                                provided: {
                                                    innerRef: Ref<HTMLDivElement>;
                                                    draggableProps: [];
                                                    dragHandleProps: [];
                                                },
                                                snapshot: {
                                                    isDragging: boolean;
                                                    draggableProps: {
                                                        style: {};
                                                    };
                                                }
                                            ) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps
                                                            .style
                                                    )}
                                                >
                                                    <SubTask
                                                        subTask={subTask}
                                                        key={subTask.id}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </StrictModeDroppable>
                </DragDropContext>
                <CreateSubTaskForm taskId={id} addSubTask={addSubTask} />
            </div>
        </div>
    );
}

// a little function to help us with reordering the result
const reorder = (list: SubTaskType[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};
