import ProfilePicture from "@/app/components/profilePicture";
import BigButton from "@/app/components/bigButton";
import User from "@/app/interfaces/user";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from "@/app/shinyhunter/profile/[id]/page";

export default function ProfileHeader({
    user
} : {
    user: User
}) {
    const handleSettings = async (event: any) => {
        event.preventDefault();
        document.location = '/shinyhunter/profile/' + user.id + '/settings';
    }

    return (
        <form className="border-solid border-2 border-black w-fit max-w-[40rem] min-w-[20rem] items-center justify-between text-sm flex flex-row p-1">
            <div className="flex flex-row p-2">
            <img src={user.avatar} alt="Profile Picture" className="h-16 w-16 fill-green" />
                <div className="flex flex-col self-center mr-2">
                    <p className="min-w-4">{user.first_name} {user.last_name}</p>
                    <p>{user.username}</p>
                </div>
            </div>
            <div className="max-w-fit max-h-[4rem] h-fit min-w-6 border-solid border-2 border-green rounded-2xl p-3 text-sm bg-red hover:bg-buttonwhite">
                <button onClick={handleSettings} className="newPage max-h-2">Edit Profile</button>
            </div>
        </form>
    )
    
}