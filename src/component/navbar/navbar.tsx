import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import NavbarDropdown from "./navbarDropdown";

export default function Navbar() {
    const { data: session } = useSession();

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
                    title="Project"
                    items={[
                        {
                            title: "Create",
                            href: "/project/create",
                            clickHandler: null,
                        },
                        {
                            title: "Search",
                            href: "/project/search",
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
                                  clickHandler: function () {
                                      signOut({ redirect: false });
                                  },
                              },
                          ]
                        : [
                              {
                                  title: "Log in",
                                  href: "/user/login",
                                  clickHandler: null
                              },
                          ]
                }
            ></NavbarDropdown>
        </div>
    );
}
