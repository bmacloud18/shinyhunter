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
        <form className="border-solid border-2 border-black w-full items-center justify-between text-sm flex flex-row">
            <div className="flex flex-row m-2">
                <ProfilePicture source={user.avatar}></ProfilePicture>
                <div className="flex flex-col self-center mr-2">
                    <p>{user.first_name} {user.last_name}</p>
                    <p>{user.username}</p>
                </div>
            </div>
            <div className="flex m-2">
                <BigButton onClick={handleSettings} text="Edit Profile"></BigButton>
            </div>
        </form>
    )
    
}