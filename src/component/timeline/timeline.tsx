import Task from "@/types/Task";
import ProjectTask from "../task/task";
import { useEffect, useState, createRef, RefObject, MouseEvent } from "react";
import TimelineDay from "./TimelineDay";
import TimelineActions from "./timelineActions";
import TimelineDayAddTask from "./TimelineDayAddTask";

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
    const timelineRef: RefObject<HTMLDivElement> = createRef();

    let [tasks, setTasks] = useState(taskList);

    let lowestTask = tasks[0]
        ? new Date(Number(tasks[0].startDate)).getTime()
        : new Date().getTime();

    let markers: number[] = addMarkers();

    function deleteTask(task: Task) {
        setTasks((taskList) => taskList.filter((t) => t.id !== task.id));
        removeTask(task);
    }

    function addTaskCallback(task: Task) {
        if (task.startDate) {
            let startDate = new Date(task.startDate);
            task.startDate = startDate.getTime();
        }
        addTask(task);
        setTasks([...tasks, task]);
    }

    // TODO: cleanup
    function addMarkers() {
        let markerArray = [];

        let latestDate = {
            startDate: tasks[tasks.length - 1]
                ? tasks[tasks.length - 1].startDate
                : new Date().getTime(),
            duration: tasks[tasks.length - 1]
                ? tasks[tasks.length - 1].duration
                : 1,
        };
        let maxDay = 500;

        if (latestDate.startDate) {
            const diffTime = Math.abs(latestDate.startDate - lowestTask);
            maxDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            maxDay += latestDate.duration ? latestDate.duration : 1;
        }

        for (let i = 0; i < maxDay + 1; i++) {
            markerArray.push(i);
        }

        return markerArray;
    }

    function handleMouseUp() {
        let event = new Event("timeline-mouse-up");
        window.dispatchEvent(event);
    }

    return (
        <div
            className="task-timeline"
            onMouseUp={handleMouseUp}
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
                        Number(lowestTask) + marker * (24 * 60 * 60 * 1000)
                    );

                    return (
                        <div
                            className="timeline-marker"
                            style={{
                                marginLeft: marker * scale + "px",
                                width: scale + "px",
                            }}
                            key={i}
                        >
                            {date.getDate() +
                                "/" +
                                (date.getMonth() + 1) +
                                "/" +
                                date.getFullYear()}
                        </div>
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
                    <ProjectTask
                        deleteTask={deleteTask}
                        task={task}
                        scale={scale}
                        key={task.id}
                        lowestTaskDate={lowestTask}
                    ></ProjectTask>
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
                                key={i}
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
                                key={i}
                            />
                        );
                    }
                )}
            </div>
        </div>
    );
}
