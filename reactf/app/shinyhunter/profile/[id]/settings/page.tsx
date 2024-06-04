"use client";
import React, { useState, useEffect } from 'react';
import api from "@/app/APIclient";
import Form from "@/app/components/form";
import User from "@/app/interfaces/user";
import sampleuser from "@/app/samples/user";


export default function UserSettings({params}: {params: {id: number}}) {
    //constants for input values
    const [user, setUser] = useState<User>();
    const [username, setUsername] = useState('');
    const [firstname, setFirst] = useState('');
    const [lastname, setLast] = useState('');
    const [currentPassword, setCurrent] = useState('');
    const [newPassword, setNew] = useState('');
    const [confirmPassword, setConfirm] = useState('');
    const [avatar, setAvatar] = useState('');

    //functions for input change
    const usernameChange = (event: any) => {
        setUsername(event.target.value)
    }
    const firstChange = (event: any) => {
        setFirst(event.target.value)
    }
    const lastChange = (event: any) => {
        setLast(event.target.value)
    }
    const currentChange = (event: any) => {
        setCurrent(event.target.value)
    }
    const newChange = (event: any) => {
        setNew(event.target.value)
    }
    const confirmChange = (event: any) => {
        setConfirm(event.target.value)
    }
    //handle hunt creation/form submission
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (user && currentPassword.length > 3 && ((firstname.length > 2 && firstname !== user.first_name) || lastname.length > 2 && lastname !== user.last_name || 
            newPassword.length > 3 && newPassword === confirmPassword)) {
                //handle image change
                const first_change = (avatar.length > 16 && avatar.substring(8, 16) === "robohash");
                
                //update user with changed values
                api.updateCurrentUserSettings(firstname, lastname, username, newPassword).then(u => {
                    localStorage.setItem('user', JSON.stringify(u));
                    const id = u.id;
                    document.location = '/shinyhunter/profile/' + id;
                }).catch((err) => {
                    console.log('Error updating user - ' + err.message);
                })
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    //fetch relevant data
    useEffect(() => {
        if (user === undefined) {
            try {
                Promise.all([api.getCurrentUser(), api.getUserById(params.id)]).then((res) => {
                    if (res[0] === res[1]) {
                        const u = res[0];
                        setUser(u);
                        setUsername(u.username);
                        setFirst(u.first_name);
                        setLast(u.last_name);
                        setAvatar(u.avatar);
                    }
                    else
                        throw new Error('Cannot edit other users\' settings');
                }).catch((err) => {
                    console.error("error occurred - " + err.message);
                })
            } catch (error: any) {
                console.error("error occurred - " + error.message);
                setUser(sampleuser);
            }
        }
    }, [params.id]);

    //define settings content

    let main = [
        (<input type="file"></input>),
        (<div className="flex flex-row gap-2">
            <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={firstname} placeholder="First Name" onChange={firstChange}/>
            <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={lastname} placeholder="Last Name" onChange={lastChange}/>
        </div>),
        (<input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={username} placeholder="Username" onChange={usernameChange}/>),
        (<input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={confirmPassword} placeholder="Confirm Password" onChange={confirmChange}></input>),
        (<input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={currentPassword} placeholder="Current Password" required={true} onChange={currentChange}></input>),
]
    return (
        <Form handleSubmit={handleSubmit} buttonText="Update Profile">
            {main}
        </Form>
    )
}