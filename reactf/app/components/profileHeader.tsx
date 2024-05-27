import ProfilePicture from "@/app/components/profilePicture";
import BigButton from "@/app/components/bigButton";

export default function ProfileHeader({
    user
} : {
    user: any
}) {
    return (
        <form className="border-solid border-2 border-black mt-8 w-full items-center justify-between font-mono text-sm lg:flex">
            <div className="flex flex-row m-2">
                <ProfilePicture source={user.avatar}></ProfilePicture>
                <div>
                    <p>{user.first_name} {user.last_name}</p>
                    <p>{user.username}</p>
                </div>
            </div>
            <div>
                <BigButton text="Edit Profile"></BigButton>
            </div>
        </form>
    )
    
}