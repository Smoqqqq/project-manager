import { useState } from "react";

interface ShortcutHelperProps {
    shortcuts: {
        key: string;
        desc: string;
    }[];
}

export default function ShortcutHelper({ shortcuts }: ShortcutHelperProps) {
    return (
        <div className="shortcut-helper">
            {shortcuts.map((shortcut) => {
                return (
                    <div className="shortcut" key={shortcut.key}>
                        <kbd>{shortcut.key}</kbd>
                        <small>{shortcut.desc}</small>
                    </div>
                );
            })}
            <kbd className="shortcut-helper-icon">kbd</kbd>
        </div>
    );
}
