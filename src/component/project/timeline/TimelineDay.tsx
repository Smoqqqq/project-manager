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

export default function TimelineDay({
    marker,
    scale,
    day,
    projectId,
    addTask,
}: TimelineDayProps) {
    return (
        <div
            className="timeline-day"
            style={{
                width: scale + "px",
            }}
            key={marker}
        >
        </div>
    );
}
