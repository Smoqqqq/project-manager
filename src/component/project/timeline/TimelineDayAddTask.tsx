import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent } from "react";
import { toast } from "react-toastify";

interface TimelineDayProps {
    marker: number;
    scale: number;
    day: Date;
    projectId: number;
    addTask: Function;
}

export default function TimelineDayAddTask({
    marker,
    scale,
    day,
    projectId,
    addTask,
}: TimelineDayProps) {
    function createTask() {
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
            } else {
                toast.error(response.message);
            }
        };

        request.send(
            `name=New%20empty%20task&description=&startDate=${day}&duration=${1}&projectId=${projectId}`
        );
    }

    return (
        <div
            className="timeline-day-add-task"
            style={{
                width: scale + "px",
                minWidth: scale + "px",
            }}
            key={marker}
            onClick={createTask}
        >
            <div className="timeline-day-icon">
                <FontAwesomeIcon icon={faPlus} />
            </div>
        </div>
    );
}
