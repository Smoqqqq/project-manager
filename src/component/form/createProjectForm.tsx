import { useRouter } from "next/router";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CreateProjectForm() {
    let form = useForm();

    let { register } = form;

    const router = useRouter();
    const organisationId = router.query.organisation;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        let { name, description } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/project/create");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = () => {
            let response = JSON.parse(request.response);

            console.log(response);

            if (response.success) {
                toast.success("Your project has been created !");

                router.push("/project/" + response.result.id);
            } else {
                toast.error(response.message);
            }
        };

        request.send(`name=${name}&description=${description}&organisationId=${organisationId}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Name *</label>
            <input {...register("name")} type="text" />

            <label>Description</label>
            <textarea {...register("description")}></textarea>

            <div className="text-right">
                <button className="btn mt-5">Create</button>
            </div>
        </form>
    );
}
