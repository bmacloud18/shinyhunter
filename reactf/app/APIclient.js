//Basic API Client, interacts with the backend of this project as well as poke-api through the pokedex import
//Defines a clean pokemon object for frontend use
import HTTPclient from './HTTPclient.js';

const API_BASE = "/api/";
const IMAGES_BASE = "/images/";

const API = {

    /*//////\\\\\\*\
    //User Routes\\
    \*\\\\\////////*/

    login: async (username, password) => {
        const data = {
            username: username,
            password: password
        };
        return HTTPclient.post('login', data, API_BASE);
    },

    logout: async () => {
        return HTTPclient.post('logout', {}, API_BASE);
    },

    register: async (username, password, first, last) => {
        const data = {
            first_name: first,
            last_name: last,
            username: username,
            password: password
        };
        return HTTPclient.post('register', data, API_BASE);
    },

    // current user
    getCurrentUser: async () => {
        try {
            return HTTPclient.get('currentuser', API_BASE);
        } catch (err) {
            console.error('error retrieving current user');
        }
    },

    getUserById: async (id) => {
        const cu = await HTTPclient.get(`users/${id}`, API_BASE);
        console.log(cu);
        if (cu) {
            return cu;
        }
        return '';
    },

    updateCurrentUserSettings: async (first, last, username, avatar) => {
        const data = {
            first_name: first,
            last_name: last,
            username: username,
            avatar: avatar
        };
        try {
            return HTTPclient.put('currentuser', data, API_BASE);
        } catch (err) {
            console.log(err.message);
        }
    },

    updatePassword: async (password, updatedPassword) => {
        const data = {
            "password": password,
            "new_password": updatedPassword
        };
        return HTTPclient.put('currentuser/password', data, API_BASE);
    },

    /*///////\\\\\\\*\
    //Pokemon Routes\\
    \*\\\\\\/////////*/

    //returns a clean pokemon object with sprite, name, types, games
    getPokemonByName: async (name) => {
        return HTTPclient.get(`pokemon/name/${name}`, API_BASE);
    },

    getAllGames: async() => {
        try {
            const gameObjects = await HTTPclient.get('pokemon/games', API_BASE);
            if (gameObjects) {
                return gameObjects.map((game) => {
                    return game.name;
                });
            }
        }
        catch(e) {
            return (['no games']);
        }
    },

    getAllMons: async() => {
        return HTTPclient.get('pokemon', API_BASE);
    },

    /*//////\\\\\*\
    //Hunt Routes\\
    \*\\\\\///////*/

    getAllHunts: async() => {
        return HTTPclient.get('hunt', API_BASE);
    },

    getCurrentUserHunts: async() => {
        return HTTPclient.get('hunt/users/current', API_BASE);
    },

    getHuntById: async(id) => {
        return HTTPclient.get(`hunt/${id}`, API_BASE);
    },

    getHuntsByUser: async(id) => {
        return HTTPclient.get(`hunt/users/id/${id}`, API_BASE);
    },

    createHunt: async(userId, pkm, game, method, start_date, end_date, time, count, increment, charm, nickname, sprite) => {
        const data = {
            userId: userId,
            pkm: pkm,
            game: game,
            method: method,
            start_date: start_date,
            end_date: end_date,
            time: time,
            count: count,
            increment: increment,
            charm: charm,
            nickname: nickname,
            sprite: sprite
        };

        console.log(data);

        return HTTPclient.post('hunt', data, API_BASE);
    },

    completeHunt: async(id, end_date) => {
        const data = {
            id: id,
            end_date: end_date
        };

        return HTTPclient.put(`hunt/complete/${id}`, data, API_BASE).catch(e => {
            throw new Error('something wrong: ' + e.message + e)
        });
    },

    updateHuntSettings: async(id, time, count, increment, charm, nickname) => {
        const data = {
            time: time,
            count: count,
            increment: increment,
            charm: charm,
            nickname: nickname
        };

        return HTTPclient.put(`hunt/settings/${id}`, data, API_BASE);
    },

    updateHunt: async(id, time, count) => {
        const data = {
            time: time,
            count: count
        };

        return HTTPclient.update(`hunt/${id}`, data, API_BASE);
    },

    deleteHunt: async(id) => {
        return HTTPclient.delete(`hunt/${id}`, API_BASE);
    },

    /*//////\\\\\\*\
    //Method Routes\\
    \*\\\\\\//////*/

    getAllMethods: async() => {
        return HTTPclient.get('method', API_BASE);
    },

    getMethodById: async(id) => {
        return HTTPclient.get(`method/${id}`, API_BASE);
    },

    /*//////\\\\\*\
    //Image Routes\\
    \*\\\\\\//////*/

    //image_path should have /images/{folder}/{filename} already appended
    getImage: async(image_path) => {
        const filename = image_path.split('/')[3];
        return HTTPclient.get(`${filename}`, API_BASE);
    },

    //uploading an image posts to the images 'upload' route
    //needs an images base to post to the proper route
    uploadImage: async(formdata, filename) => {
        const data = {
            filename: filename
        }
        await HTTPclient.upload('uploads', formdata, IMAGES_BASE)

        const response = await HTTPclient.post('images', data, API_BASE);
        console.log(response);
        return response;
    },

    //deleting an image also has the full route already saved
    deleteImage: async(image_path) => {
        const filename = image_path.split('/')[3];
        await HTTPclient.delete(`${filename}`, API_BASE);
        return HTTPclient.delete(`${image_path}`, IMAGES_BASE);
    }

};

export default API;
