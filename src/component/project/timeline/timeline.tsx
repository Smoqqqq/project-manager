import Task from "@/types/Task";
import ProjectTask from "../task/task";
import {
    useEffect,
    useRef,
    useState,
    FormEvent,
    createRef,
    RefObject,
    MouseEvent,
} from "react";
import TimelineDay from "./TimelineDay";
import TimelineActions from "./timelineActions";
import TimelineDayAddTask from "./TimelineDayAddTask";
import { useSession } from "next-auth/react";
// TODO:  scroll au drag
interface TimelineProps {
    tasks: Task[];
    deleteTask: Function;
    projectId: number;
    addTask: Function;
}

export default function Timeline({
    tasks: taskList,
    deleteTask: removeTask,
    projectId,
    addTask,
}: TimelineProps) {
    let [scale, setScale] = useState(150); // days / 100px
    let [mouseX, setMouseX] = useState(0);
    let [mouseDown, setMouseDown] = useState(false);
    const timelineRef: RefObject<HTMLDivElement> = createRef();

    let [tasks, setTasks] = useState(taskList);

    function deleteTask(task: Task) {
        setTasks((taskList) => taskList.filter((t) => t.id !== task.id));
        removeTask(task);
    }

    let lowestTask = tasks[0]
        ? tasks[0].startDate
        : new Date().getTime()

    useEffect(() => {
        if (timelineRef.current) {
            timelineRef.current.scrollLeft = mouseX;
        }
    }, [mouseX]);

    let markers: number[] = addMarkers();

    function addTaskCallback(task: Task) {
        if (task.startDate) {
            let startDate = new Date(task.startDate);
            task.startDate = startDate.getTime();
        }
        addTask(task);
        setTasks([...tasks, task]);
    }

    function orderTasks() {
        for (let i = 0; i < tasks.length; i++) {
            let currentStart = tasks[i].startDate
                ? new Date(Number(tasks[i].startDate))
                : false;
            let lowestStart = lowestTask
                ? new Date(lowestTask)
                : false;
            if (
                (tasks[i].startDate && !lowestTask) ||
                (currentStart &&
                    lowestStart &&
                    currentStart.getTime() < lowestStart.getTime())
            ) {
                lowestTask = tasks[i].startDate;
            }
        }
    }

    function addMarkers() {
        let markerArray = [];

        let latestDate =
            tasks.length > 1
                ? tasks[tasks.length - 1]
                : {
                      startDate: new Date().getTime(),
                      duration: 1,
                  };
        let latestDuration = latestDate.duration ? latestDate.duration : 1;
        let maxDay =
            latestDate.startDate && lowestTask
                ? Math.round(
                      (latestDate.startDate - lowestTask) /
                          (1000 * 60 * 60 * 24)
                  ) + latestDuration
                : 500;

        for (let i = 0; i < maxDay + 1; i++) {
            markerArray.push(i);
        }

        return markerArray;
    }

    function handleMouseDown() {
        setMouseDown(true);
    }

    function handleMouseUp() {
        setMouseDown(false);
    }

    function handleMouseLeave() {
        setMouseDown(false);
    }

    function handleMouseMove(e: MouseEvent) {
        if (e.movementX && mouseDown) {
            setMouseX(mouseX - e.movementX);
        }
    }

    orderTasks();

    return (
        <div
            className="task-timeline"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            ref={timelineRef}
        >
            <TimelineActions scale={scale} setScale={setScale} />

            <div
                id="timeline-marker-container"
                style={{
                    width: markers.length * scale + "px",
                }}
            >
                {markers.map((marker, i) => {
                    let date = new Date(
                        Number(lowestTask) +
                            marker * (24 * 60 * 60 * 1000)
                    );

                    return (
                        <>
                            <div
                                className="timeline-marker"
                                style={{
                                    marginLeft: marker * scale + "px",
                                    width: scale + "px",
                                }}
                                key={marker + i}
                            >
                                {date.getDate() +
                                    "/" +
                                    (date.getMonth() + 1) +
                                    "/" +
                                    date.getFullYear()}
                            </div>
                        </>
                    );
                })}
                {/* Close last date */}
                <div
                    className="timeline-marker"
                    style={{
                        marginLeft: (markers.length - 1) * scale + "px",
                        width: scale + "px",
                    }}
                ></div>
            </div>

            {tasks.map((task, i) => {
                return (
                    <>
                        <ProjectTask
                            deleteTask={deleteTask}
                            task={task}
                            scale={scale}
                            key={task.id}
                            lowestTaskDate={lowestTask}
                            setDragOff={handleMouseDown}
                        ></ProjectTask>
                    </>
                );
            })}

            <div className="timeline-days">
                {[...markers, markers[markers.length - 1] + 1].map(
                    (marker, i) => {
                        let day = new Date(Number(lowestTask));
                        day = new Date(day.setDate(day.getDate() + marker));

                        return (
                            <TimelineDay
                                marker={marker}
                                scale={scale}
                                day={day}
                                projectId={projectId}
                                addTask={addTaskCallback}
                                key={marker + i}
                            />
                        );
                    }
                )}
            </div>
            <div className="timeline-days-add">
                {[...markers, markers[markers.length - 1] + 1].map(
                    (marker, i) => {
                        let day = new Date(Number(lowestTask));
                        day = new Date(day.setDate(day.getDate() + marker));

                        return (
                            <TimelineDayAddTask
                                marker={marker}
                                scale={scale}
                                day={day}
                                projectId={projectId}
                                addTask={addTaskCallback}
                                key={marker + i}
                            />
                        );
                    }
                )}
            </div>
        </div>
    );
}
