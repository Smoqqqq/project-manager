import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavbarDropdownItem from "./NavbarDropdownItem";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import NavbarDropdownItemProps from "./NavbarDropdownItem";

interface NavbarDropdownProps {
    title: string;
    items: {
        title: string;
        href: string | null;
        clickHandler: Function | null;
    }[];
}

export default function NavbarDropdown({
    title,
    items,
}: NavbarDropdownProps) {
    return (
        <div className="navbar-dropdown">
            <div className="navbar-dropdown-title">
                {title} <FontAwesomeIcon icon={faCaretDown} />
            </div>
            <div className="navbar-dropdown-body">
                {items.map((item, index) => {
                    return (
                        <NavbarDropdownItem
                            title={item.title}
                            href={item.href}
                            clickHandler={item.clickHandler}
                            key={index}
                        ></NavbarDropdownItem>
                    );
                })}
            </div>
        </div>
    );
}
