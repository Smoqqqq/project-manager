import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@prisma/client";

export default function UserProfile({ user }: { user: User }) {
    return (
        <div className="user-profile">
            <FontAwesomeIcon icon={faCircleUser} />
            <div>
                <p>{user.email}</p>
                <small>{user.username ? user.username : ""}</small>
            </div>
        </div>
    );
}
