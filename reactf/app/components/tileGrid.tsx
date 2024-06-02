export default function Grid({
    children
} : {
    children?: Array<React.ReactNode>;
}) {

    return (
        <>
            <div className="overflow-y-auto h-[40rem] w-full p-4 flex flex-col gap-1 border-solid border-2">{children}</div>
        </>
    )
    
}