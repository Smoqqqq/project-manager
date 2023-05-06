import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SubTask as SubTaskType } from "@prisma/client";
import { useState } from "react";
import EditSubTaskForm from "./editSubTaskForm";

interface subTaskProps {
    subTask: SubTaskType
}

export default function SubTask({ subTask: st }: subTaskProps) {

    let [edit, setEdit] = useState(false);

    let [subTask, setSubTask] = useState(st);

    function updateSubTask(task: SubTaskType) {
        setEdit(false);
        setSubTask(task);
    }

    if (edit) {
        return <EditSubTaskForm subTask={subTask} setSubTask={updateSubTask} />
    }

    return (
        <div className="sub-task" onDoubleClick={() => { setEdit(true) } }>
            <div className="content">
                <h4>{subTask.name}</h4>
                <p>
                    {subTask.description}
                </p>
            </div>
            <div className="icon">
                {subTask.duration} h&nbsp;&nbsp;
                <FontAwesomeIcon icon={faClock} />
            </div>
        </div>
    );
}
