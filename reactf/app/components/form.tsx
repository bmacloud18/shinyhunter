import { FormEventHandler } from "react";

export default function Form({
    children,
    handleSubmit
} : {
    children?: Array<React.ReactNode> | React.ReactNode;
    handleSubmit?: FormEventHandler;
}) {

    return (
<main className="mt-96 flex flex-col min-h-screen items-center m-auto">
            <h1 className="h5 mb-3 fw-normal text-center">Enter Information for a New Hunt</h1>
            <form className="w-96 h-fit mb-24 flex flex-col items-center justify-around border-solid border-2 border-black p-10 gap-8" onSubmit={handleSubmit}>
                {children}
                <button className="border-solid border-2 border-green mr-2 rounded-2xl p-2 bg-red hover:bg-buttonwhite"></button>
            </form>
        </main>
    )
    
}