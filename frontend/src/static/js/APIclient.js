//Basic API Client, interacts with the backend of this project as well as poke-api through the pokedex import
//Defines a clean pokemon object for frontend use
import HTTPclient from './HTTPclient.js';

function getGames(pokemon) {
    let ret = [];
    for (g in pokemon.game_indices)
    {
        ret.push(g.version.name);
    }
    return ret;
}

//cleans up the types array from PokeAPI
function getTypes(pokemon) {
    let ret = [];
    for (t in pokemon.types)
    {
        ret.push(t.type.name);
    }
    return ret;
}

export default {

    /*//////\\\\\\*\
    //User Routes\\
    \*\\\\\////////*/

    login: async (username, password) => {
        const data = {
            username: username,
            password: password
        };
        return HTTPclient.post('login', data);
    },

    logout: async () => {
        return HTTPclient.post('logout', {});
    },

    register: async ( first, last, username, password ) => {
        const data = {
            first_name: first,
            last_name: last,
            username: username,
            password: password
        };
        return HTTPclient.post('register', data);
    },

    // current user
    getCurrentUser: async () => {
        return HTTPclient.get('currentuser');
    },

    getUserById: async (id) => {
        return HTTPclient.get(`users/${id}`);
    },

    updateCurrentUserSettings: async (first, last, username, avatar) => {
        const data = {
            first_name: first,
            last_name: last,
            username: username,
            avatar: avatar
        };
        return HTTPclient.put( 'currentuser', data );
    },

    updatePassword: async ( password, updatedPassword ) => {
        const data = {
            "password": password,
            "new_password": updatedPassword
        };
        return HTTPclient.put( 'currentuser/password', data );
    },

    // updateSettings: async ( darkMode, notifications, largeText ) => {
    //     const data = {
    //         "dark": darkMode,
    //         "notify": notifications,
    //         "text": largeText
    //     };
    //     return HTTPclient.put( 'currentuser/settings', data );
    // },

    /*///////\\\\\\\*\
    //Pokemon Routes\\
    \*\\\\\\/////////*/

    //returns a clean pokemon object with sprite, name, types, games
    getPokemonByName: async (name) => {
        return HTTPclient.get(`pokemon/name/${name}`);
    },

    getAllGames: async() => {
        return HTTPclient.get('pokemon/games');
    },

    getAllMons: async() => {
        return HTTPclient.get('pokemon');
    },

    /*//////\\\\\*\
    //Hunt Routes\\
    \*\\\\\///////*/

    getCurrentUserHunts: async() => {
        return HTTPclient.get('hunt/users/current');
    },

    getHuntById: async() => {
        return HTTPclient.get(`hunt/${id}`);
    },

    getHuntsByUser: async() => {
        return HTTPclient.get(`hunt/users/id/${id}`)
    },

    createHunt: async(userId, pkm, game, method, start_date, end_date, count, increment, charm, nickname) => {
        const data = {
            userId: userId,
            pkm: pkm,
            game: game,
            method: method,
            start_date: start_date,
            end_date, end_date,
            count: count,
            increment: increment,
            charm: charm,
            nickname: nickname
        };

        return HTTPclient.post('/hunt', data);
    },

    completeHunt: async(id, end_date) => {
        const data = {
            id: id,
            end_date: end_date
        };

        return HTTPclient.put(`hunt/${id}/complete`, data)
    },

    updateHunt: async(id, start_date, count, increment, nickname) => {
        const data = {
            id: id,
            start_date: start_date,
            count: count,
            increment: increment,
            nickname: nickname
        };

        return HTTPclient.put(`hunt/${id}`, data)
    }

};

