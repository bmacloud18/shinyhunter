export default function typeGrid({
    children
} : {
    children?: Array<React.ReactNode>;
}) {

    return (
        <>
            <div className="max-h-[48rem] mt-16 rounded-xl border-2 border-black border-solid justify-around w-3/5 flex flex-row p-8">{children}</div>
        </>
    )
    
}