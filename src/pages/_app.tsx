import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { ToastContainer, toast } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/component/navbar/navbar";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    const ESCAPE_KEY = "Escape";
    
    let router = useRouter();

    useEffect(() => {
        if (router.query.toast) {
            toast.error(atob(String(router.query.toast)))
        }
    })

    function handleEscKey(event: KeyboardEvent) {
        if (event.code === ESCAPE_KEY) {
            let event = new Event("exit-modal");
            window.dispatchEvent(event);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            handleEscKey(e);
        });
    }, []);

    return (
        <>
            <SessionProvider session={session}>
                <ToastContainer />
                <Navbar />
                <div id="main-page-container">
                    <Component {...pageProps} />{" "}
                </div>
            </SessionProvider>
        </>
    );
}
