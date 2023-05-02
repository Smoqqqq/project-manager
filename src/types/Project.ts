import { User } from "@prisma/client"

type Project = {
    id: number,
    name: string,
    description: string|null,
    createdAt: String|Date,
    author: User
}

export default Project;