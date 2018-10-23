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
    const reader = new FileReader();

    // reader to create base 64 image
   //add the description section to the end of the image

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));
    //post time show underneath the person who posted

    section.appendChild(createElement('p', new Date(post.meta.published*1000), { style: 'padding:5px 10px;font-size:9pt;font-style: italic;color:grey;margin:auto'}));
    section.appendChild(createElement('p', post.meta.description_text, { style: 'padding:5px 10px;font-size:11pt;margin:auto'}));


    //append the image to large feed
   section.appendChild(createElement('img', null,{ src: 'data:image/jpg;base64,' + post.src, alt: post.meta.description_text, class: 'post-image' }));

    //add two div for comments and likes 
    const comment_div = createElement('span',null,{style:'width:50%;float:left;margin:auto'})
    const like_div = createElement('span',null,{style:'width:50%;float:left;margin:auto'})
    
    //add like icon to the like div
    //<i onclick="myFunction(this)" class="fa fa-thumbs-up"></i>
    const like_btn = createElement('i',null,{class:'fa fa-thumbs-up',user_ids:post.meta.likes,data_post_id:post.id});
    like_div.appendChild(like_btn);

    //add comment icon to the comment div
    //<i class="fa fa-comment" style="font-size:24px"></i>
    const comment_btn = createElement('i',null,{class:'fa fa fa-comment',style:'left:3em !important'});
    comment_div.appendChild(comment_btn);

    //create like text and number same for comments
    comment_div.appendChild(createElement('p', `Comments: ${post.comments.length}`, { style: 'padding:10px 10px;font-size:11pt;color:grey;text-align:center;margin:auto' }));
    like_div.appendChild(createElement('p', `Likes: ${post.meta.likes.length}`, {class:'like','data_likes':post.meta.likes}));


    section.appendChild(comment_div);
    section.appendChild(like_div);
    section.appendChild(document.createElement('HR'));

    //add comments to the post
    /*
    <div class="col-sm-5">
    </div>
    */
    post.comments.forEach(c=> {
        let comment_post = createElement('div',null,{class:'row-sm-5'});
        comment_post.innerHTML = `
            <div class="panel panel-default" style="border:none">
                <div class="panel-heading">
                    <strong>${c.author}</strong> <span class="text-muted">Published:${new Date(c.published*1000)}</span>
                </div>
                <div class="panel-body">
                   ${c.comment} 
                </div><!-- /panel-body -->
            </div><!-- /panel panel-default -->
        `

        section.appendChild(comment_post);
    })





    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(file) {
//    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
   
    /*
    reader.onload = (e) => {
        //do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };
    */
    // this returns a base64 image
    reader.readAsDataURL(file);

    return reader;
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





