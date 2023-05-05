import { User } from "@prisma/client";

type Task = {
    id: number;
    name: string;
    description: string | null;
    startDate: number | undefined;
    duration: number | null;
    author: User;
    authorId: number;
    assignedUsers: User[] | null;
    createdAt: number | undefined;
};

export default Task;
