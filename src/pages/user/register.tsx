import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function RegisterUser() {
    const form = useForm();
    let { register } = form;

    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        let { email, username, password } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/user/register");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = async () => {
            let response = JSON.parse(request.response);

            if (response.success) {
                toast.success("Your account has been created !");

                let res = await signIn("credentials", {
                    email: encodeURI(email),
                    password: encodeURI(password),
                    redirect: false,
                }).then((res) => {
                    console.log(res);
                    router.push("/organisation/create");
                });
            } else {
                toast.error(response.message);
            }
        };

        request.send(
            new URLSearchParams({
                email: email,
                password: password,
                username: username,
            })
        );
    }

    return (
        <form>
            <label>Email</label>
            <input type="email" id="email" {...register("email")} />
            <label>Username</label>
            <input type="text" id="username" {...register("username")} />
            <label>Password</label>
            <input type="password" id="password" {...register("password")} />

            <button className="btn" type="button" onClick={handleSubmit}>
                Submit
            </button>
        </form>
    );
}
