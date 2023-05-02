import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/component/navbar";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
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
