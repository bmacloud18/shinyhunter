//handle image change
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";
import Img from "@/app/interfaces/image";


export default async function fileupload(avatar: string, user: User, formdata: FormData, url: string, new_avatar: string) {
    console.log("on upload", formdata);
    const first_change = (avatar.length > 16 && user.avatar.substring(8, 16) === "robohash");
    if (!first_change) {
        try {
            const res = await api.getImage(user.avatar);

            if (res === 'picture') {
                const deleteres = await api.deleteImage(user.avatar);

                console.log('delete status: ' + deleteres)
    
                if (deleteres === 'imaged deleted') {
                    const uploadres = await api.uploadImage(formdata, new_avatar);

                    return uploadres;
                }
                else {
                    throw new Error('Error uploading image');
                }
            }
    
        } catch (err: any) {
            if (err.message == "404") {
                await api.uploadImage(formdata).catch((err) => {
                    throw new Error('Error uploading image (no delete): ' + err)
                });
            }
            else {
                throw new Error('Something wrong with get');
            }
        }
    }
    else {
        return api.uploadImage(formdata, new_avatar).catch((err) => {
            throw new Error('Error uploading image (no delete)' + err);
        })
    }
}
