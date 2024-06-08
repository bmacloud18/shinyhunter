//Basic HTTP Client, fulfills requests which come from the API client
// const getBase = () => {
//     if (typeof window ==='undefined') {
//         return 
//     }
//     else {
//         return './api/'
//     }
// };


const handleError = (res) => {
    if(!res.ok) {
        if(res.status == 401) {
            localStorage.removeItem('user');
            document.location = '/';
            throw new Error("Unauthenticated - bad api fetch");
        }
        else {
            throw new Error(res.status, res.message);
        }
    }
    
    return res;
};

export default {
    
    get: async (url, location) => {
        return fetch(location + url, {
            headers: {
            }
        }).then(handleError).then(res => {
            return res.json();
        });
    },
  
    post: async (url, data, location) => {
        return fetch(location + url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(handleError).then(res => {
            return res.json();
        });
    },
  
    put: async (url, data, location) => {
        return fetch(location + url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(handleError).then(res => {
            return res.json();
        });

    },

    delete: async (url, location) => {
        return fetch(location + url, {
            method: 'DELETE',
            headers: {
            }
        }).then(handleError).then(res => {
            return res.json();
        });
    },

    upload: async (url, formdata, location) => {
        return fetch(location + url, {
            method: 'POST',
            body: formdata
        }).then(handleError).then(res => {
            return res.json();
        });
    }
};
  