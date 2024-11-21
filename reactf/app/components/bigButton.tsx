import { MouseEventHandler } from "react";

export default function BigButton({
    text,
    onClick
}: {
    text:any,
    onClick: MouseEventHandler
}) {
    return (
        <div className="max-w-fit border-solid border-2 border-green rounded-2xl p-5 bg-red hover:bg-buttonwhite">
            <button onClick={onClick} className="newPage">{text}</button>
        </div>
    );
}