"use client";
import React, { useState } from 'react';
import BigButton from "@/app/components/bigButton";
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";
import Hunt from "@/app/interfaces/hunt";
import Pokemon from "@/app/interfaces/pokemon";

export default function HuntSettings() {
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    console.log('signin', typeof window !== 'undefined');

    const usernameChange = (event: any) => {
        setUsernameValue(event.target.value)
    }
    const passwordChange = (event: any) => {
        setPasswordValue(event.target.value);
    }
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (usernameValue.length > 4 && passwordValue.length > 3) {
                console.log(usernameValue, passwordValue);
                api.login(usernameValue, passwordValue).then(user => {
                    localStorage.setItem('user', JSON.stringify(user));
                    const id = user.id;
                    document.location = '/shinyhunter/profile/' + id;
                }).catch((err) => {
                    console.log('Username or Password Invalid - ' + err.message);
                })
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    return (
        <main className="mt-96 flex flex-col min-h-screen items-center m-auto">
            <h1 className="h5 mb-3 fw-normal text-center">Sign In to your ShinyHunter Account</h1>
            <form className="w-96 h-48 mb-24 flex flex-col items-center justify-around gap-8" onSubmit={handleSubmit}>
              <div className="border-solid border-2 border-black p-10 flex flex-col gap-2">
                <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={usernameValue} placeholder="Username" required={true} onChange={usernameChange}/>
                <input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={passwordValue} placeholder="Password" required={true} onChange={passwordChange}></input>
              </div>
              <BigButton text="Sign In"></BigButton>
            </form>
        </main>
    );
}