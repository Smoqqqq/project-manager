import Link from "next/link";

interface NavbarDropdownItemProps {
    title: string;
    href: string | null;
    clickHandler: Function | null;
}

export default function NavbarDropdownItem({
    title,
    href,
    clickHandler,
}: NavbarDropdownItemProps) {
    if (href && href !== "") {
        return (
            <Link href={href} className="navbar-dropdown-item">
                {title}
            </Link>
        );
    } else if (clickHandler) {
        return (
            <div
                className="navbar-dropdown-item"
                onClick={() => {
                    clickHandler();
                }}
            >
                {title}
            </div>
        );
    } else {
        return <div className="navbar-dropdown-item">{title}</div>;
    }
}