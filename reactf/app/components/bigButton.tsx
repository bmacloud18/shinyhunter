export default function BigButton({
    text,
}: {
    text:any
}) {
    return (
        <div className="border-solid border-2 border-green mr-2 rounded-2xl p-5 bg-red hover:bg-buttonwhite">
            <button className="">{text}</button>
        </div>
    );
}