export default function Grid({
    children
} : {
    children?: Array<React.ReactNode>;
}) {

    return (
        <>
            <div className="w-full grid grid-cols-1 gap-4 overflow-auto">{children}</div>
        </>
    )
    
}