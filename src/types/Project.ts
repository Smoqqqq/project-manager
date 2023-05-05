import { User } from "@prisma/client";
import Task from "./Task";

type Project = {
    id: number;
    name: string;
    description: string | null;
    createdAt: String | Date;
    author: User;
    tasks: Task[];
};

export default Project;
