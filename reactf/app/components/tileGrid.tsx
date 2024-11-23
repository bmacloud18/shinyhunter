export default function Grid({
    children
} : {
    children?: Array<React.ReactNode>;
}) {

    return (
        <>
            <div className="overflow-y-auto h-[40rem] w-[22rem] flex flex-col content-center self-center gap-1">{children}</div>
        </>
    )
    
}