export default function typeGrid({
    children
} : {
    children?: Array<React.ReactNode>;
}) {

    return (
        <>
            <div className="max-h-[72rem] min-w-fit mt-16 rounded-xl border-2 border-black border-solid justify-between flex flex-row p-8 sm:p-4">{children}</div>
        </>
    )
    
}