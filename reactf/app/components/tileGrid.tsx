export default function Grid({
    children
} : {
    children?: Array<React.ReactNode>;
}) {

    return (
        <>
            <div className="overflow-y-auto w-fit flex flex-col content-center self-center gap-1 mb-2">{children}</div>
        </>
    )
    
}