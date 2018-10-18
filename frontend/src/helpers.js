/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });
    const comments = createElement('div',null,)

    //add the description section to the end of the image
    


    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));
    section.appendChild(createElement('p', post.meta.description_text, { style: 'padding:10px 10px;font-size:11pt;'}));
    section.appendChild(createElement('img', null,{ src: '/images/'+post.src, alt: post.meta.description_text, class: 'post-image' }));

    //add two div for comments and likes 
    const comment_div = createElement('div',null,{style:'width:50%;float:left'})
    const like_div = createElement('div',null,{style:'width:50%;float:left'})

    comment_div.appendChild(createElement('p', `Comments: ${post.meta.comments.length}`, { style: 'padding:10px 10px;font-size:11pt;color:grey;text-align:center' }));
    like_div.appendChild(createElement('p', `Likes: ${post.meta.likes.length}`, { style: 'padding:10px 10px;font-size:11pt;color:grey;text-align:center' }));
    section.appendChild(comment_div);
    section.appendChild(like_div);
    section.appendChild(document.createElement('HR'));
    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}



