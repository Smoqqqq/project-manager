import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CreateOrganisationForm() {
    let form = useForm();
    let { register } = form;

    let [emails, setEmails] = useState<string[]>([]);

    function handleSubmit() {
        let { name } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/organisation/create");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            if (response.success) {
                toast.success("organisation created !");
            } else {
                toast.error(response.message);
            }
        };

        request.send(`name=${name}&users=${emails}`);
    }

    function handleEnter(e: KeyboardEvent) {
        let { email } = form.getValues();

        if (e.code === "Enter") {

            if (emails.includes(email)) {
                return;
            }

            if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                toast.warning("Invalid address");
                return;
            }
            setEmails([...emails, email]);
        }
    }

    function removeEmail(email: string) {
        setEmails((emails) => emails.filter((e) => e !== email));
    }

    return (
        <div>
            <label>Name</label>
            <input type="text" {...register("name")} />

            <label>Invite users</label>
            <input type="text" {...register("email")} onKeyDown={handleEnter} />

            <div className="my-3">
                {emails.map((email) => {
                    return (
                        <div className="badge mr-1" key={email}>
                            {email}
                            <span
                                onClick={() => {
                                    removeEmail(email);
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} className="ml-1" />
                            </span>
                        </div>
                    );
                })}
            </div>

            <button className="btn" onClick={handleSubmit}>
                Create
            </button>
        </div>
    );
}
