export default function Grid({
    children
} : {
    children?: Array<React.ReactNode>;
}) {

    return (
        <>
            <div className="overflow-y-auto h-[40rem] w-full p-4 justify-center border-solid border-2 grid grid-cols-1">{children}</div>
        </>
    )
    
}