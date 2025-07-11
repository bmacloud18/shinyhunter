
    //local storage functions
    function saveDataToLocalStorage(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    function getDataFromLocalStorage(key: string) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    export default {
        saveDataToLocalStorage,
        getDataFromLocalStorage
    }
    

