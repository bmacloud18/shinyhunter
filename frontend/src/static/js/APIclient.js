import HTTPclient from './HTTPclient.js';

export default {

    /*//////\\\\\\*\
    //User Routes\\
    \*\\\\\////////*/
    login: async ( username, password ) => {
        const data = {
            username: username,
            password: password
        };
        return HTTPclient.post( 'login', data );
    },

    logout: async () => {
        return HTTPclient.post( 'logout', {} );
    },

    register: async ( first, last, username, password ) => {
        const data = {
            first_name: first,
            last_name: last,
            username: username,
            password: password
        };
        return HTTPclient.post( 'register', data );
    },

    // current user
    getUser: async () => {
        return HTTPclient.get( 'currentuser' );
    },

    getUserById: async (id) => {
        return HTTPclient.get( `users/${id}` );
    }
}