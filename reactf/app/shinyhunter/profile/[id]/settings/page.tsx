"use client";
import React, { useState, useEffect } from 'react';
import api from "@/app/APIclient";
import Form from "@/app/components/form";
import User from "@/app/interfaces/user";
import sampleuser from "@/app/samples/user";
import fileUpload from "@/app/util/fileupload";
import Image from "next/image";


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
    const [formdata, setFormdata] = useState(new FormData());

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
            reader.readAsDataURL(file);
            reader.onload = function(e) {
                if (file.type.substring(0, 5) != 'image') {
                    event.target.setCustomValidity('File not a valid image');
                }
                else {
                    if (e.target && e.target.result && typeof(e.target.result) == 'string') {
                        formdata.append('pfp', file);
                        setAvatar(e.target.result);
                        event.target.setCustomValidity('');
                    }
                }
            }
        }
    }
    //handle hunt creation/form submission
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (user && ((firstname.length > 2 && firstname !== user.first_name) || (lastname.length > 2 && lastname !== user.last_name) || (avatar !== user.avatar))) {
                const url = '/images/uploads/';
                const avatar_string = url + filename;
                const res = await fileUpload(avatar, user, formdata, avatar_string).catch((err) => {
                    console.log("errrrr" + err);
                });
                setFilename('');

                console.log(res);
                
                if (res == 'image uploaded') {
                    api.updateCurrentUserSettings(firstname, lastname, username, avatar_string).then(u => {
                        localStorage.setItem('user', JSON.stringify(u));
                        setUser(u);
                        const id = u.id;
                        // document.location = '/shinyhunter/profile/' + id;
                    }).catch((err) => {
                        console.log('Error updating user - ' + err.message);
                    })
                }
                
            }
        } catch (error: any) {
            throw new Error(error.message);
        }

        try {
            if (user && currentPassword.length > 3 && newPassword.length > 3 && newPassword === confirmPassword) {
                api.updatePassword(currentPassword, newPassword).then((res) => {

                }).catch((err) => {
                    if (err.status === 401)
                        throw new Error("Unauthenticated (current password incorrect)");
                    else
                        throw new Error("Invalid password");
                });
            }
        } catch(err) {
            throw new Error("Unable to change password" + err);
        }
    }

    //fetch relevant data
    useEffect(() => {
        Promise.all([api.getCurrentUser(), api.getUserById(params.id)]).then((res) => {
            if (res[0].username === res[1].username) {
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
            console.log("error occurred - couldn't connect to api - " + err.message);
        })
    }, [params.id]);

    //define settings content
    let preview = avatar !== '' ? (
            <Image key="s1" className="border border-1 border-green w-24 h-24" id="preview" src={avatar} alt="preview" height="96" width="96"></Image>
    ) : (
        <span key="s1"></span>
    )

    let main = [
        (preview),
        (<label key="s2" className="mb-4 text-sm font-medium text-grey dark:text-white" htmlFor="file_input">
            <span>Upload PFP</span>
            <input className="file:bg-green rounded-2xl block text-medium file:text-buttonwhite text-black border border-1 border-black cursor-pointer" type="file" id="file_input" onChange={fileChange}></input>
        </label>),
        (<input key="s3" className="w-[12rem] sm:w-[8rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={username} placeholder="Username" onChange={usernameChange}/>),
        (<div key="s4" className="flex flex-row gap-2 mb-4">
            <input className="w-[12rem] sm:w-[8rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={firstname} placeholder="First Name" onChange={firstChange}/>
            <input className="w-[12rem] sm:w-[8rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" type="text" value={lastname} placeholder="Last Name" onChange={lastChange}/>
        </div>),
        (<div key="s5" className="w-fit flex flex-col items-center gap-1">
            <div className="w-fit">Authenticate to Update Password</div>
            <div>
                <input type="password" className="w-[16rem] sm:w-[12rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={currentPassword} placeholder="Current Password" onChange={currentChange}></input>
            </div>
            <div className="flex flex-row gap-2">
                <input type="password" className="w-[15rem] sm:w-[10rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={newPassword} placeholder="New Password" onChange={newChange}></input>
                <input type="password" className="w-[15rem] sm:w-[10rem] border-solid border-2 border-green p-2 focus:outline-none rounded-xl" value={confirmPassword} placeholder="Confirm Password" onChange={confirmChange}></input>
            </div>
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