import CreateTaskForm from "@/component/form/createTaskForm";
import ProjectTask from "@/component/project/task/task";
import Timeline from "@/component/project/timeline/timeline";
import ProjectHeader from "@/component/project/projectHeader";
import Project from "@/types/Project";
import Task from "@/types/Task";
import { Organisation, PrismaClient, User } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";

interface ProjectProps {
    project: {
        id: number;
        name: string;
        description: string | null;
        createdAt: String | Date;
        author: User;
        tasks: Task[];
        organisation: Organisation;
    };
    tasks: Task[];
}

export default function Project({ project: projectData, tasks }: ProjectProps) {
    const addTaskBtn = (
        <button className="btn" onClick={addTaskForm}>
            Add task
        </button>
    );

    let [project, setProject] = useState(projectData);

    let [taskList, setTasksList] = useState(tasks);

    let [taskForm, setTaskForm] = useState(addTaskBtn);

    const addTask = (task: Task) => {
        setTasksList([...taskList, task]);
    };

    const deleteTask = (task: Task) => {
        let taskId = task.id;

        let request = new XMLHttpRequest();
        request.open("POST", "/api/project/task/delete");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            if (response.success) {
                toast.success("Task successfully deleted");

                setTasksList((taskList) =>
                    taskList.filter((task) => task.id !== taskId)
                );
            } else {
                toast.error(response.message);
            }
        };

        request.send(`taskId=${taskId}`);
    };

    const removeTaskForm = () => {
        setTaskForm(addTaskBtn);
    };

    function addTaskForm() {
        setTaskForm(
            <CreateTaskForm
                project={project}
                addTask={addTask}
                removeTaskForm={removeTaskForm}
            ></CreateTaskForm>
        );
    }

    return (
        <div id="project">
            <ProjectHeader project={project} setProject={setProject} />

            <h2 className="mt-5">Tasks</h2>

            {taskForm}

            <hr className="mt-5" />

            <Timeline
                tasks={taskList}
                deleteTask={deleteTask}
                projectId={project.id}
                addTask={addTask}
            />
        </div>
    );
}

interface ServerSideProps {
    query: {
        projectId: number;
    };
}

export const getServerSideProps = async (context: ServerSideProps) => {
    let { projectId } = context.query;
    projectId = Number(projectId);

    let prisma = new PrismaClient();
    let project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            organisation: true
        },
    });

    let tasksRaw = await prisma.task.findMany({
        where: {
            project: {
                id: projectId,
            },
        },
        include: {
            author: true,
            assignedUsers: true,
        },
        orderBy: {
            startDate: "asc",
        },
    });

    let tasks: Task[] = [];

    tasksRaw.map((task) => {
        tasks.push({
            ...task,
            createdAt: task.createdAt.getTime(),
            startDate: task.startDate ? task.startDate.getTime() : 0,
        });
    });

    return {
        props: {
            project: project,
            tasks: tasks,
        },
    };
};
