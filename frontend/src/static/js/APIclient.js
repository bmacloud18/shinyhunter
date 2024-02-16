//Basic API Client, interacts with the backend of this project as well as poke-api through the pokedex import
//Defines a clean pokemon object for frontend use
import HTTPclient from './HTTPclient.js';
import pokedex from './pokdex.js';

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

//used for one pokemon, i.e. for hunts
function cleanMon(pokemon, species) {
    return {
      id: pokemon.order,
      name: pokemon.name,
      avatar: pokemon.sprites.front_shiny,
      types: getTypes(pokemon),
      games: getGames(species),
      color: species.color.name
    }
}

//used for full pokemon list
function minMon(pokemon) {
    return {
        id: pokemon.order,
        name: pokemon.name,
        avatar: pokemon.sprites.front_shiny,
      }
}

function cleanMons(pokemon) {
    let ret = [];
    for (p in pokemon)
    {
        ret.push(minMon(p));
    }

    return ret;
}

function cleanGame(game) {
    return {
        name: game.name
    }
}

function cleanGames(games) {
    let ret = [];
    for (g in games) 
    {
        ret.push(cleanGame(g));
    }

    return ret;
}

export default {

    /*//////\\\\\\*\
    //User Routes\\
    \*\\\\\////////*/
    login: async ( username, password ) => {
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
    getUser: async () => {
        return HTTPclient.get('currentuser');
    },

    getUserById: async (id) => {
        return HTTPclient.get(`users/${id}`);
    },

    /*///////\\\\\\\*\
    //Pokemon Routes\\
    \*\\\\\\/////////*/

    //returns a clean pokemon object with sprite, name, types, games
    getPokemonByName: async (name) => {
        const pokemon_obj = await pokedex.getPokemonByName(name);
        const species_obj = await pokedex.getPokemonSpeciesByName(name);

        return cleanMon(pokemon_obj, species_obj);
    },

    getAllGames: async() => {
        const interval = {
            offset: 0,
            limit: 43,
        }
        return pokedex.getVersionsList(interval).then(results => {
            return cleanGames(results.results);
        });
    },

    getAllMons: async() => {
        const interval = {
            offset: 0,
            limit: 1000,
        }
        return pokedex.getPokemonList(interval).then(results => {
            return cleanMons(results.results);
        });
    }

    /*//////\\\\\*\
    //Hunt Routes\\
    \*\\\\\///////*/

    // getCurrentUserActiveHunts: async() => {
        
    // }


    // getCurrentUserFinishedHunts: async() => {
        
    // }
};

