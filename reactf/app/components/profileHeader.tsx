import ProfilePicture from "@/app/components/profilePicture";

export default function ProfileHeader({
    user
} : {
    user: any
}) {
    return (
        <div>
            <ProfilePicture source={user.avatar}></ProfilePicture>
            <div>
                <p>{user.first_name} {user.last_name}</p>
                <p>{user.username}</p>
            </div>
        </div>
    )
    
}