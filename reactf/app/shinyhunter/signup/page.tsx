"use client";
import React, { useState } from 'react';
import BigButton from "@/app/components/bigButton";
import api from "@/app/APIclient";
export default function Signin() {
    const [usernameValue, setUsername] = useState('');
    const [passwordValue, setPassword] = useState('');
    const [confirmValue, setConfirm] = useState('');
    const [firstValue, setFirst] = useState('');
    const [lastValue, setLast] = useState('');

    const usernameChange = (event: any) => {
        setUsername(event.target.value)
    }
    const passwordChange = (event: any) => {
        setPassword(event.target.value);
    }
    const confirmChange = (event: any) => {
        setConfirm(event.target.value);
    }
    const firstChange = (event: any) => {
        setFirst(event.target.value);
    }
    const lastChange = (event: any) => {
        setLast(event.target.value);
    }
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (usernameValue.length >= 4 && passwordValue.length > 3 && confirmValue === passwordValue && firstValue.length > 1 && lastValue.length > 1) {
                console.log(usernameValue, passwordValue, firstValue, lastValue);
                api.register(usernameValue, passwordValue, firstValue, lastValue).then(user => {
                    localStorage.setItem('user', JSON.stringify(user));
                    const id = user.id;
                    document.location = '/shinyhunter/profile/' + id;
                }).catch((err) => {
                    console.log('Error with Signup- ' + err.message);
                })
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    const SignIn = (event: any) => {
        document.location = '/shinyhunter/signin';
    }

    return (
        <main className="mt-96 flex flex-col min-h-screen items-center m-auto">
            <h1 className="h5 mb-3 fw-normal text-center">Sign In to your ShinyHunter Account</h1>
            <form className="w-96 h-48 mb-24 flex flex-col items-center justify-around gap-8" onSubmit={handleSubmit}>
              <div className="border-solid border-2 border-black p-10 flex flex-col gap-2">
                <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={usernameValue} placeholder="Username" required={true} onChange={usernameChange}/>
                <input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={passwordValue} placeholder="Password" required={true} onChange={passwordChange}></input>
                <input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={confirmValue} placeholder="Confirm Password" required={true} onChange={confirmChange}></input>
                <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={firstValue} placeholder="First Name" required={true} onChange={firstChange}/>
                <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={lastValue} placeholder="Last Name" required={true} onChange={lastChange}/>
              </div>
              <button className="max-w-fit border-solid border-2 border-green rounded-2xl p-5 bg-red hover:bg-buttonwhite">Sign Up</button>
            </form>
            <BigButton text="Sign In" onClick={SignIn}></BigButton>
        </main>
    );
}