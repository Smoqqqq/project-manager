import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import NavbarDropdown from "./navbarDropdown";
import { useRouter } from "next/router";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();

    let userEmail = "Not connected";
    let logout = (
        <Link href="/user/login" className="log-in-out">
            Log in
        </Link>
    );

    let logAction = {
        title: "Log in",
        href: "/user/login",
        clickHandler: () => {},
    };

    if (session && session.user && session.user.email) {
        userEmail = session.user.email;
        logAction = {
            title: "Log out",
            href: "",
            clickHandler: function () {
                signOut({ redirect: false });
            },
        };
    }

    return (
        <div id="navbar">
            <div id="navbar-nav">
                <Link href="/">Home</Link>
                <NavbarDropdown
                    title="Organisations"
                    items={[
                        {
                            title: "My organisations",
                            href: "/organisation/search",
                            clickHandler: null,
                        },
                        {
                            title: "New",
                            href: "/organisation/create",
                            clickHandler: null,
                        },
                    ]}
                ></NavbarDropdown>
            </div>
            <NavbarDropdown
                title={userEmail}
                items={
                    session && session.user && session.user.email
                        ? [
                              {
                                  title: "Log out",
                                  href: null,
                                  clickHandler: async function () {
                                      await signOut({ redirect: false });
                                      router.push("/user/login");
                                  },
                              },
                          ]
                        : [
                              {
                                  title: "Log in",
                                  href: "/user/login",
                                  clickHandler: null,
                              },
                          ]
                }
            ></NavbarDropdown>
        </div>
    );
}
