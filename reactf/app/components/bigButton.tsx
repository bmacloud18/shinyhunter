export default function BigButton({
    text
}: {
    text:any
}) {
    return (
        <div className="border-solid border-2 border-black mr-2">
            <button className="">{text}</button>
        </div>
    );
}