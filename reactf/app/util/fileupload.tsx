//handle image change
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";

export default async function fileupload(avatar: string, user: User, formdata: FormData, url: string) {
    console.log("on upload", formdata);
    const first_change = (avatar.length > 16 && user.avatar.substring(8, 16) === "robohash");
    if (!first_change) {
        try {
            const res = await api.getImage(user.avatar);
    
            if (res.status === 404) {
                const err = new Error("404");
                throw err;
            }
    
            if (res.status === 200) {
                const deleteres = await api.deleteImage(user.avatar);
    
                if (deleteres.status === 200) {
                    await api.uploadImage(formdata).catch((err) => {
                        throw new Error('Error uploading image' + err);
                    });
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
        await api.uploadImage(formdata).catch((err) => {
            throw new Error('Error uploading image (no delete)' + err);
        })
    }
}
