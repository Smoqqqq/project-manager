import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function RegisterUser() {
    const form = useForm();
    let { register } = form;

    const router = useRouter();

    function handleSubmit() {
        let { email, username, password } = form.getValues();

        let request = new XMLHttpRequest();
        request.open("POST", "/api/user/register");
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );

        request.onload = async () => {
            let response = JSON.parse(request.response);

            console.log(response)

            if (response.success) {
                toast.success("Your account has been created !");

                await signIn("credentials", {
                    email: email,
                    password: password,
                    redirect: false,
                }).then((res) => {
                    console.log(res)
                    // router.push("/organisation/create");
                });

            } else {
                toast.error(response.message);
            }
        };

        request.send(
            `email=${email}&username=${username}&password=${password}`
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

            <button
                className="btn"
                type="button"
                onClick={() => {
                    handleSubmit();
                }}
            >
                Submit
            </button>
        </form>
    );
}
