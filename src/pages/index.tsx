import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    if (session) {
        router.push("/project/search");
    }

    return (
        <>
            <h1>Hi</h1>
        </>
    );
}
