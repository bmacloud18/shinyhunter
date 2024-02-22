//Basic HTTP Client, fulfills requests which come from the API client
const API_BASE = './api/';

const handleError = (res) => {
    if(res.ok)
        return res;
    let error = new Error(res.statusText);
    error.status = res.status;
    throw error;
};

export default {
    get: async (url) => {
        return fetch(API_BASE + url, {
            headers: {
            }
        }).then(handleError).then(res => {
            return res.json();
        });
    },
  
    post: async (url, data) => {
        return fetch(API_BASE + url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(handleError).then(res => {
            return res.json();
        });
    },
  
    put: async (url, data) => {
        return fetch(API_BASE + url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(handleError).then(res => {
            return res.json();
        });

    },

    delete: async (url) => {
        return fetch(API_BASE + url, {
            method: 'DELETE',
            headers: {
            }
        }).then(handleError).then(res => {
            return res.json();
        });
    },  
};
  