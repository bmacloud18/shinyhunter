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
    const [filename, setFilename] = useState('');

    let formdata = new FormData();

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
    const fileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setFilename(file.name);
            const reader = new FileReader();
            formdata = new FormData();
            reader.readAsDataURL(file);
            console.log(reader);
            reader.onload = function(e) {
                if (file.type.substring(0, 5) != 'image') {
                    event.target.setCustomValidity('File not a valid image');
                }
                else {
                    if (e.target && e.target.result && typeof(e.target.result) == 'string') {
                        setAvatar(e.target.result);
                        event.target.setCustomValidity('');
                        formdata.append('pfp', file);
                    }
                }
            }
        }
    }
    //handle hunt creation/form submission
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (user && currentPassword.length > 3 && ((firstname.length > 2 && firstname !== user.first_name) || lastname.length > 2 && lastname !== user.last_name || 
            newPassword.length > 3 && newPassword === confirmPassword)) {
                //handle image change
                const first_change = (avatar.length > 16 && user.avatar.substring(8, 16) === "robohash");
                const url = 'images/uploads/';
                const avatar_string = url + filename;
                setFilename('');
                if (!first_change) {
                    try {
                        const res = await fetch(user.avatar, {
                            method: 'GET'
                        });

                        if (res.status === 404) {
                            const err = new Error("404");
                            throw err;
                        }

                        if (res.status === 200) {
                            const deleteres = await fetch(user.avatar, {
                                method: 'DELETE'
                            });

                            if (deleteres.status === 200) {
                                await fetch(url, {
                                    method: 'POST',
                                    body: formdata
                                }).catch((err) => {
                                    throw new Error('Error uploading image' + err);
                                })
                            }
                        }

                    } catch (err: any) {
                        if (err.message == "404") {
                            await fetch(url, {
                                method: 'POST',
                                body:formdata
                            }).catch((err) => {
                                throw new Error('Error uploading image (no delete): ' + err)
                            })
                        }
                        else {
                            throw new Error('Something wrong with get');
                        }
                    }
                }
                else {
                    await fetch(url, {
                        method: 'POST',
                        body: formdata
                    }).catch((err) => {
                        throw new Error('Error uploading image (no delete)' + err);
                    })
                }

                //update user with changed values
                try {
                    api.updateCurrentUserSettings(firstname, lastname, username, avatar_string).then(u => {
                        localStorage.setItem('user', JSON.stringify(u));
                        setUser(u);
                        const id = u.id;
                        document.location = '/shinyhunter/profile/' + id;
                    }).catch((err) => {
                        console.log('Error updating user - ' + err.message);
                    })
                } catch (err: any) {
                    throw new Error('Error occurred updating user: ' + err.message);
                }
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
    let preview = avatar !== '' ? (
            <img className="border border-1 border-green w-24 h-24" id="preview" src={avatar}></img>
    ) : (
        <span></span>
    )

    let main = [
        (preview),
        (<label className="mb-4 text-sm font-medium text-grey dark:text-white" htmlFor="file_input">
            <span>Upload PFP</span>
            <input className="file:bg-green font-sans rounded-2xl block text-medium file:text-buttonwhite text-black border border-1 border-black cursor-pointer" type="file" id="file_input" onChange={fileChange}></input>
        </label>),
        (<div className="flex flex-row gap-2">
            <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={firstname} placeholder="First Name" onChange={firstChange}/>
            <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={lastname} placeholder="Last Name" onChange={lastChange}/>
            <input className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={username} placeholder="Username" onChange={usernameChange}/>
        </div>),
        (<div className="flex flex-row gap-2">
            <input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={newPassword} placeholder="New Password" onChange={newChange}></input>
            <input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={confirmPassword} placeholder="Confirm Password" onChange={confirmChange}></input>
            <input type="password" className="border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={currentPassword} placeholder="Current Password" required={true} onChange={currentChange}></input>
        </div>),
        // (),
        // (),
        // (),
]
    return (
        <Form handleSubmit={handleSubmit} buttonText="Update Profile">
            {main}
        </Form>
    )
}