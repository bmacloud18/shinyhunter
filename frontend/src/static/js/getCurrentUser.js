//Retrieves the current user from the backend
//Redirects to login if error retrieving user
import api from './APIclient.js';

export const user = await api.getUser().catch( () => {
    location.href = './guest';
});
