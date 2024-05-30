"use client";
import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import BigButton from "@/app/components/bigButton";
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";
import Pokemon from "@/app/interfaces/pokemon";


export default function NewHunt() {
    const [user, setUser] = useState<User>();
    const [pokemonOptions, setPokemonOptions] = useState<Pokemon[]>([]);
    const [gameOptions, setGameOptions] = useState([]);
    const [methodOptions, setMethodOptions] = useState([]);
    const [pokemonValue, setPokemon] = useState('');
    const [gameValue, setGame] = useState('');
    const [methodValue, setMethod] = useState('');
    const [nicknameValue, setNickname] = useState('');
    const [incrementValue, setIncrement] = useState<number>();
    const [charmValue, setCharm] = useState<boolean>(false);
    const [countValue, setCount] = useState<number>();
    const [timeValue, setTime] = useState<number>();
    const [importValue, setImport] = useState<boolean>(false);
    const [startValue, setStart] = useState<Date>();
    const [endValue, setEnd] = useState<Date | undefined>();

    console.log('signin', typeof window !== 'undefined');

    const pokemonChange = (event: any) => {
        setPokemon(event.target.value);
    }
    const gameChange = (event: any) => {
        setGame(event.target.value)
    }
    const methodChange = (event: any) => {
        setMethod(event.target.value)
    }
    const nicknameChange = (event: any) => {
        setNickname(event.target.value)
    }
    const incrementChange = (event: any) => {
        setIncrement(event.target.value)
    }
    const charmChange = (event: any) => {
        setCharm(event.target.value)
    }
    const countChange = (event: any) => {
        setCount(event.target.value)
    }
    const timeChange = (event: any) => {
        setTime(event.target.value)
    }
    const importChange = (event: any) => {
        setImport(event.target.value)
    }
    const startChange = (event: any) => {
        setStart(event.target.value)
    }
    const endChange = (event: any) => {
        setEnd(event.target.value)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (user && pokemonValue && gameValue && methodValue && nicknameValue && incrementValue && charmValue) {
                console.log(pokemonValue, gameValue, methodValue, nicknameValue);
                let start_date = new Date();
                let end_date = null; 
                let time = 0;
                let count = 0;

                if (importValue && startValue && timeValue && countValue) {
                    start_date = startValue;
                    if (endValue) {
                        end_date = endValue;
                    }
                    time = timeValue;

                }

                api.createHunt(user.id, pokemonValue, gameValue, methodValue, start_date, end_date, time, count, incrementValue, charmValue, nicknameValue).then(hunt => {
                    document.location = '/shinyhunter/hunt/' + hunt.id;
                }).catch((err) => {
                    console.log('Username or Password Invalid - ' + err.message);
                })
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    useEffect(() => {
        try {
            Promise.all([api.getCurrentUser(), api.getAllGames(), api.getAllMethods(), api.getAllMons()]).then((res) => {
                setUser(res[0]);
                setGameOptions(res[1]);
                setMethodOptions(res[2]);
                setPokemonOptions(res[3]);
            })
        } catch (error: any) {
            console.log("unable to communicate with api");
        }
    });

    let po: any[] = [];
    let go: String[] = [];
    let mo: String[] = [];

    
    if (pokemonOptions !== undefined) {
        po = pokemonOptions.map((pkm: Pokemon) => {
            return {
                value: pkm.name,
                label:pkm.name,
                image: pkm.sprite
            }
        });

        
    }
    if (gameOptions !== undefined) {

    }
    if (methodOptions !== undefined) {

    }

    let main = (
        <div className="border-solid border-2 border-black p-10 flex flex-col gap-2">
            <Select onChange={pokemonChange} value={pokemonValue} options={po} formatOptionLabel={(pkm: any) => (
                    <div className="pkm-option">
                        <img src={pkm.image} alt="pkm-image" />
                        <span>{pkm.label}</span>
                    </div>
                )}
            />
            <div className="flex flex-row"> 
                <Select onChange={gameChange} value={gameValue} options={po} formatOptionLabel={(pkm: any) => (
                        <div className="pkm-option">
                            <img src={pkm.image} alt="pkm-image" />
                            <span>{pkm.label}</span>
                        </div>
                    )}
                />
                <Select onChange={methodChange} value={methodValue} options={po} formatOptionLabel={(pkm: any) => (
                        <div className="pkm-option">
                            <img src={pkm.image} alt="pkm-image" />
                            <span>{pkm.label}</span>
                        </div>
                    )}
                />
            </div>
            <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={nicknameValue} placeholder="Nickname" required={true} onChange={nicknameChange}/>
            <div>
                <input type="number" className="border-solid border-2 border-green p-1 focus:outline-none rounded-xl" value={incrementValue} placeholder="Increment" required={true} onChange={incrementChange}></input>
                <input type="checkbox" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" placeholder="Charm" required={true} onChange={charmChange}></input>
            </div>
            <input type="checkbox" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" placeholder="Importing Hunt?" required={true} onChange={importChange}></input>
        </div>
    );

    let importContent = (
        <div className="flex flex-col">
            <div>
                <input type="number" className="border-solid border-2 border-green p-1 focus:outline-none rounded-xl" value={countValue} placeholder="Increment" required={true} onChange={countChange}></input>
                <input type="number" className="border-solid border-2 border-green p-1 focus:outline-none rounded-xl" value={timeValue} placeholder="Increment" required={true} onChange={timeChange}></input>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <input type="date" onChange={startChange}></input>
                    <button className="border-solid border-2 border-green mr-2 rounded-xl p-1 bg-red hover:bg-buttonwhite">Use Today</button>
                </div>
                <div>
                    <input type="date" onChange={endChange}></input>
                    <button className="border-solid border-2 border-green mr-2 rounded-xl p-1 bg-red hover:bg-buttonwhite">Not Complete</button>
                </div>
            </div>
        </div>
    )

    return !importValue ? (
        <main className="mt-96 flex flex-col min-h-screen items-center m-auto">
            <h1 className="h5 mb-3 fw-normal text-center">Sign In to your ShinyHunter Account</h1>
            <form className="w-96 h-48 mb-24 flex flex-col items-center justify-around gap-8" onSubmit={handleSubmit}>
                {main}
                <button className="border-solid border-2 border-green mr-2 rounded-2xl p-2 bg-red hover:bg-buttonwhite"></button>
            </form>
        </main>
    ) : (
        <main className="mt-96 flex flex-col min-h-screen items-center m-auto">
            <h1 className="h5 mb-3 fw-normal text-center">Sign In to your ShinyHunter Account</h1>
            <form className="w-96 h-48 mb-24 flex flex-col items-center justify-around gap-8" onSubmit={handleSubmit}>
                {main}
                {importContent}
                <button className="border-solid border-2 border-green mr-2 rounded-2xl p-2 bg-red hover:bg-buttonwhite"></button>
            </form>
        </main>
    );
}