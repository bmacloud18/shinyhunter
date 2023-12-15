import api from './APIclient.js';

export const user = await api.getUser().catch( () => {
    location.href = './guest';
});
