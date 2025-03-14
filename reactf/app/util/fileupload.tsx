//handle image change
import api from "@/app/APIclient";
import User from "@/app/interfaces/user";
import Img from "@/app/interfaces/image";


export default async function fileupload(avatar: string, user: User, formdata: FormData, new_avatar: string) {
    console.log("on upload", formdata);
    const first_change = (avatar.length > 16 && user.avatar.substring(8, 16) === "robohash");
    if (!first_change) {
        try {
            const res = await api.getImage(user.avatar);
            console.log(res);

            if (res === 'found image') {
                const deleteres = await api.deleteImage(user.avatar);

                console.log('delete status: ' + deleteres)
    
                if (deleteres === 'image deleted') {
                    console.log('uploading post delete');
                    return api.uploadImage(formdata, new_avatar.split('/')[3]).catch((err) => {
                        throw new Error('Error uploading image (no delete)' + err);
                    });
                }
                else {
                    throw new Error('Error deleting image');
                }
            }
    
        } catch (err: any) {
            if (err.message == "404" || err.message == "400") {
                console.log('uploading post err');
                await api.uploadImage(formdata, new_avatar.split('/')[3]).then((res) => {
                    return 'image uploaded'
                }).catch((err) => {
                    throw new Error('Error uploading image (no delete) even after bypass' + err);
                });
            }
            else {
                throw new Error('Something wrong with get');
            }
        }

        return 'image uploaded'
    }
    else {
        return api.uploadImage(formdata, new_avatar.split('/')[3]).catch((err) => {
            console.log('uploading first change');
            throw new Error('Error uploading image (no delete)' + err);
        });
    }
}
