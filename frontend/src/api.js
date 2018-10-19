// change this when you integrate with the real API, or when u start using the dev server
//const API_URL = 'http://localhost:8080/data'

const getJSON = (path, options) => {
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));
}
/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     */
    constructor(url) {
        this.url = url;
    } 

    makeAPIRequest(option) {
        return getJSON(`${this.url}`,option);
    }

    /**
     * @returns feed array in json format
     */
    getFeed(option) {
        return this.makeAPIRequest(option);
    }

    /**
     * @returns auth'd user in json format
     */
    getMe() {
        return this.makeAPIRequest('me.json');
    }

}
