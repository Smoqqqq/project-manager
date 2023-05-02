import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Login() {
    const form = useForm();
    let { register } = form;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        let { email, password } = form.getValues();

        let res = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });

        if (!res) {
            toast.error("Error logging in");
            return;
        }

        if (res.ok) {
            toast.success("Logged in !");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" id="email" {...register("email")} />
            <label>Password</label>
            <input type="password" id="password" {...register("password")} />

            <button className="btn mt-5">Submit</button>
        </form>
    );
}
