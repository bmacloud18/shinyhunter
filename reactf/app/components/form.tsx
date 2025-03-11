import { FormEventHandler } from "react";

export default function Form({
    children,
    handleSubmit,
    buttonText,
    formText
} : {
    children?: Array<React.ReactNode> | React.ReactNode;
    handleSubmit?: FormEventHandler;
    buttonText?: String;
    formText?: String;
}) {

    return (
        <main className="flex flex-col min-h-screen justify-center place-items-center">
            <h1 className="h5 mb-3 fw-normal text-center">{formText}</h1>
            <form className="w-fit h-fit flex flex-col items-center justify-around border-solid border-2 border-green p-4 gap-2" onSubmit={handleSubmit}>
                {children}
                <button className="mt-4 border-solid border-2 border-green mr-2 rounded-2xl p-2 bg-red hover:bg-buttonwhite">{buttonText}</button>
            </form>
        </main>
    );
    
}