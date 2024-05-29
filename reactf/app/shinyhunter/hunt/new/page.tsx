"use client";
import React, { useState } from 'react';
import Select from 'react-select'
import BigButton from "@/app/components/bigButton";
import api from "@/app/APIclient";
import Hunt from "@/app/interfaces/hunt";
import Pokemon from "@/app/interfaces/pokemon";

export default function NewHunt() {
    const [pokemonOptions, setPokemonOptions] = useState([]);
    const [gameOptions, setGaneOptions] = useState([]);
    const [methodOptions, setMethodOptions] = useState([]);
    const [pokemonValue, setPokemon] = useState('');
    const [gameValue, setGame] = useState('');
    const [methodValue, setMethod] = useState('');
    const [nicknameValue, setNickname] = useState('');
    const [incrementValue, setIncrement] = useState('');
    const [charmValue, setCharm] = useState('');
    const [countValue, setCount] = useState('');
    const [timeValue, setTime] = useState('');

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
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (gameValue.length > 4 && pokemonValue.length > 3) {
                console.log(gameValue, pokemonValue);
                api.login(gameValue, pokemonValue).then(user => {
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

    let po = [];
    let go;
    let mo;

    
    if (pokemonOptions !== undefined) {
        po = pokemonOptions.map((pkm: Pokemon) => {
            return {
                value: pkm.name,
                label:pkm.name
            }
        })
    }
    if (gameOptions !== undefined) {

    }
    if (methodOptions !== undefined) {

    }

    return (
        <main className="mt-96 flex flex-col min-h-screen items-center m-auto">
            <h1 className="h5 mb-3 fw-normal text-center">Sign In to your ShinyHunter Account</h1>
            <form className="w-96 h-48 mb-24 flex flex-col items-center justify-around gap-8" onSubmit={handleSubmit}>
              <div className="border-solid border-2 border-black p-10 flex flex-col gap-2">
                <Select value={pokemonValue} options={po} formatOptionLabel={(pkm) => (
                    
                    )}
                />
                <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={gameValue} placeholder="Username" required={true} onChange={gameChange}/>
                <input type="pokemon" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={pokemonValue} placeholder="Password" required={true} onChange={pokemonChange}></input>
              </div>
              <BigButton text="Submit Hunt"></BigButton>
            </form>
        </main>
    );
}