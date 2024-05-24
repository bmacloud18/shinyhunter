import ProfilePicture from "@/app/components/profilePicture";

export default function ProfileHeader({
    user
} : {
    user: any
}) {
    return (
        <div>
            <ProfilePicture source="next.svg"></ProfilePicture>
            <div>
                <p>User Name</p>
                <p>@username</p>
            </div>
        </div>
    )
    
}