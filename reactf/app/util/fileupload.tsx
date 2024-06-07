//handle image change
import User from "@/app/interfaces/user";

export default async function fileupload(avatar: string, user: User, formdata: FormData, url: string) {
    const first_change = (avatar.length > 16 && user.avatar.substring(8, 16) === "robohash");
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
}
