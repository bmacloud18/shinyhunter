import { MouseEventHandler } from "react";

export default function BigButton({
    text,
    onClick
}: {
    text:any,
    onClick: MouseEventHandler
}) {
    return (
        <div className="border-solid border-2 border-green mr-2 rounded-2xl p-5 bg-red hover:bg-buttonwhite">
            <button onClick={onClick} className="">{text}</button>
        </div>
    );
}