// importing named exports we use brackets
import * as helper  from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';


//my code============================================================
const large_feed = document.getElementById('large-feed');
const head = document.querySelector('head');
let user_name = '';
let  password ='';
let post_ids= [];
let loaded_posts = 0;

//insert create modal on to the page
const header =document.querySelector('.banner'); 
header.appendChild(make_modal());

//set modal default display none
let myModal = document.getElementById('myModal');
var cross = document.getElementsByClassName("close")[0];
myModal.style.display ="none";
let modal_posts = document.getElementById('modal_posts');

//add like button css
const like_css = helper.createElement('link',null,{rel:'stylesheet',href:'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'});
head.appendChild(like_css);


//addd scroll event
window.addEventListener('scroll', () =>{
    //defined the offset and when scroll to the bottom of the page load new content
    const scroll_top = large_feed.scrollTop;
    const height = large_feed.offsetHeight
    const offset_header = 149
    //console.log(pageYOffset+window.innerHeight,height + offset_header);

    //load the next 10 pages
    let start = 0;
    loaded_posts === 0 ? start = 1 : start = 0;
    const ids = post_ids.slice(loaded_posts,loaded_posts+5);
    var promises = []; 
    let hit_bottom = pageYOffset+window.innerHeight === height + offset_header;

    //if hit the bottom load more posts on profile pages
    if((hit_bottom || start === 1 ) && helper.checkStore('status') === '1'){
        ids.forEach(post_id => {
            const token = helper.checkStore('user');
            const option = {
                method:'GET',
                headers:{
                    'accept': 'application/json',
                    'Authorization': 'Token ' + token
                }
            };
            //append promises to the list
            promises.push(fetch(`http://127.0.0.1:5000/post/?id=${post_id}`,option)
            .then(res => res.json())
            .catch(err => console.log(err)));

        })

        //got the post ids
        Promise.all(promises)
        .then(posts => {
            posts.forEach(post => {
               //wrap the post and put onto large_feed
               large_feed.appendChild(helper.createPostTile(post));
               loaded_posts++;
            })
            //modol bind likes so that when click like txt will show who likes this post
            modal_bind_like();
            //bind like when click on the like icon user like this post
            like_click();
            //only bind the edit and delte icon on the post if the page is the login user page
            if(helper.checkStore('status') === '1') bind_edit();

         })
    }

    
    //if from home page scroll to the bottom of the page load more user feed
    if((hit_bottom || start === 1 ) && helper.checkStore('status') === '0'){
        console.log(loaded_posts);
        //get user's feed from the data base and render as user's home page
        const token = helper.checkStore('user');
        const option = {
            method:'GET',
            headers:{
                'accept': 'application/json',
                'Authorization': 'Token ' + token
            }
        };

        fetch(`http://127.0.0.1:5000/user/feed?p=${loaded_posts}&n=${loaded_posts + 5}`,option)
        .then(res =>res.json())
        .then(r => {
            r.posts.forEach(post => {
                large_feed.appendChild(helper.createPostTile(post));
                loaded_posts++;
            })
            
            //modol bind likes so that when click like txt will show who likes this post
            modal_bind_like();
            //bind like when click on the like icon user like this post
            like_click();
            //bind the user name on the post tile to render that user's homep page
            user_click();
        });
    }    
});

//depend on user status render different pages
if(helper.checkStore('user')){
    //check the status of the logined in user
    const status = helper.checkStore('status');
    console.log(status);
    if(status === '0') render_home();
    if(status === '1') render_profile();
    if(status === '2') render_profile(helper.checkStore('on_profile'));

} else {
    render_login();
}

//========================Functions===============================================
//render login page
function render_login() {
    //tunr on the background
    document.querySelector('body').classList.add('background')

    //clear the original content in large feed
    large_feed.innerHTML ='';

    //remove the user name
    const user_but = document.querySelector('.astext');
    if(user_but) user_but.remove();


    //remove the upload file
    const post_but = document.getElementById('post_btn');
    if(post_but) post_but.remove();

    //remove the bootstrap css for login page
    let bootstrap = document.getElementById('bootstrap');
    if(bootstrap) bootstrap.remove();

    //creat an dive for form body stype that encapsulate the form
    const body_form = helper.createElement('div',null,{class:'form-body'});

    //create a user login form
    const form = helper.createElement('form',null,{class:'login-form'});
    form.style.cssText = 'width: 340px;margin: 50px auto';

    //header
    const log_head = helper.createElement('h2','Log in');
    log_head.style.cssText = 'text-align:center';
    form.appendChild(log_head);

    //form group div ---------for user name
    const form_div = helper.createElement('div');
    form_div.style.cssText = 'margin-bottom: 15px';

    //input test
    const input_user = helper.createElement('input',null,{class:'form-con',type:'text',placeholder:'User Name'});
    form_div.appendChild(input_user);
    form.appendChild(form_div);

    //form group div ---------for password
    const form_div2 = helper.createElement('div');
    form_div2.style.cssText = 'margin-bottom: 15px';

    //input text 
    const input_password = helper.createElement('input',null,{class:'form-con',type:'password',placeholder:'Password'});
    form_div2.appendChild(input_password);
    form.appendChild(form_div2);

    //log in div
    const login_div = helper.createElement('div',null,{class:'form-body'});

    //log in button
    const login_btn = helper.createElement('button',"Log in",{class:'butt',type:'submit'});
    login_div.appendChild(login_btn);
    form.appendChild(login_div);

    //sign up div
    const sign_div = helper.createElement('div',null,{class:'form-body'});

    //log in button
    const sign_btn = helper.createElement('button',"Sign up",{class:'butt',type:'submit'});
    sign_div.appendChild(sign_btn);
    form.appendChild(sign_div);

    //append finally to the large feed
    body_form.appendChild(form)
    large_feed.appendChild(body_form);

    //user click on sign in
    login_btn.addEventListener('click',(e) => {
        e.preventDefault();
        user_name = input_user.value;
        password = input_password.value;
       
        //check user name and pass word if valid render home else alert
        validate_user(user_name,password) 
    });

    //user click on sign up
    sign_btn.addEventListener('click',(e) => {
         e.preventDefault();
        //render the state of the element of the orignal form
        
        //will add sign up form filed to the log in form
        //usr name ,password, emial, name
        //remove log button and change sign up to submit
        sign_btn.remove();
        login_btn.remove();

        input_user.required=true;
        input_password.required =true;

        const submit_btn = helper.createElement('button',"Submit",{class:'butt',type:'submit'});
        sign_div.appendChild(submit_btn);
        form.appendChild(sign_div);
        
        //reset the form
        form.reset()

        //change form title to Sign up
        log_head.innerText = "Sign up";

        //form group div ---------for name
        const form_div3 = helper.createElement('div');
        form_div3.style.cssText = 'margin-bottom: 15px';

        //name filled 
        const input_name = helper.createElement('input',null,{class:'form-con',type:'text',placeholder:'Name',required:'required'});
        form_div3.appendChild(input_name);
        form.insertBefore(form_div3,form.children[3]);

        //form group div ---------for email
        const form_div4 = helper.createElement('div');
        form_div4.style.cssText = 'margin-bottom: 15px';

        //name filled 
        const input_email = helper.createElement('input',null,{class:'form-con',type:'text',placeholder:'Email',required:'required'});
        form_div4.appendChild(input_email);
        form.insertBefore(form_div4,form.children[4]);

        //add event listener for sumbit button
        submit_btn.addEventListener('click',(e) => {
            e.preventDefault();
            
            console.log(input_user.value);
            //payload for sign up
            const payload = {
                  "username": input_user.value,
                  "password": input_password.value, 
                  "email": input_email.value,
                  "name": input_name.value 
            }
            //get the input into the data base
            fetch('http://127.0.0.1:5000/auth/signup', {
                method:'POST',
                body:JSON.stringify(payload),
                headers:{
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
              .then((r) => {
                    //check response and see if the sign up success
                    if(r.token) {   //sign up success save token in the storage
                        window.localStorage.setItem('user',r.token); 
                        window.localStorage.setItem('name',user_name); 
                        
                        render_home();
                    }else {     //sign up failed show reason
                        const form = document.querySelector('form');
                        form.reset();
                        alert(`Error Occured: ${r.message}`);
                    }
              })
              .catch(err => console.log(err));
        })
    });
}


//will take in user name and password return 1 if valid 0 if not
function validate_user (name, pass) {
    //check user name and password against backend
    const payload = {
        'username': name, 
        'password': pass
    }

    fetch('http://127.0.0.1:5000/auth/login', {
        method:'POST',
        body:JSON.stringify(payload),
        headers:{
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
      .then((r) => {
            //check if user login valid
            //console.log(r.token);
            if(r.token) {   //login success save token in the local storage and reurn 1
                window.localStorage.setItem('user',r.token); 
                window.localStorage.setItem('name',user_name);
                render_home();
            }else {     //login fail reset the form return 0
                const form = document.querySelector('form');
                form.reset();
                alert("Wrong User Name or Password!");
            }
        })
      .catch((err) => console.log(err));

}

//will render home page once the user login
function render_home() {
    //get the user id and store in the local storage
    const token = helper.checkStore('user');
    const option = {
        method:'GET',
        headers:{
            'accept': 'application/json',
            'Authorization': 'Token ' + token
        }
    };
    fetch('http://127.0.0.1:5000/user',option)
    .then(res =>res.json())
    .then(r => window.localStorage.setItem('curr_id',r.id));

    //tunr on the background
    document.querySelector('body').classList.remove('background')

    //change stauts in the localstorage
    window.localStorage.setItem('status',0);

    ///insert the style reference link from bootstrap
    if(document.getElementById('bootstrap') === null) {
        const bootstrap = helper.createElement('link',null,{id:'bootstrap',href:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',rel:'stylesheet'});
        head.appendChild(bootstrap);
    }

    //remove the login form
    large_feed.innerHTML ='';

    //create the log off button
    if(!document.getElementById('log_off')) make_log_off();

    //add post button to the top of the page
    if(document.getElementById('post_btn') === null) make_post_btn();

    //add user name button at the top
    if(document.querySelector('.astext') === null) make_user_btn();
    //update the user btn name accordingly depend on whos profile page it is 
    const user_btn = document.getElementById('user_btn').children[0];
    user_btn.innerText = helper.checkStore('name');

    //show attach feed to large_feed
     loaded_posts = 5;

    fetch(`http://127.0.0.1:5000/user/feed?p=0&n=5`,option)
    .then(res =>res.json())
    .then(r => {
        r.posts.forEach(post => {
            large_feed.appendChild(helper.createPostTile(post));
        })
       
        //modol bind likes so that when click like txt will show who likes this post
        modal_bind_like();
        //bind like when click on the like icon user like this post
        like_click();
        //bink the coment button so that when click present user with the modal for input comments
        modal_bind_comment();
        //bind the user name on the post tile to render that user's homep page
        user_click();

    });
}


//when click on the post title of that user, will render that user's profile page
function user_click() {
    const user_titles = document.querySelectorAll('.post-title');

    //bind each user_title on each post to the event listener
    user_titles.forEach(user => {
        var name_span = user.children[0];
        if(name_span.getAttribute('added') === null) {       //means has not been added the event listener
            name_span.addEventListener('click', (e) => {
                render_profile(name_span.innerText);         //will listen to the click and render that user page
            })
            //add the user atrributes as added 
            name_span.setAttribute('added',true);
        }
    })
}

//bind the delte and edit icon on the post
function bind_edit() {
    const edits = document.querySelectorAll('.glyphicon-pencil');
    const removes = document.querySelectorAll('.glyphicon-remove');
    
    //bind delete to delete the post
    removes.forEach(remove => {
        if(remove.getAttribute('added') === null) {
            remove.addEventListener('click', (e) => {
                let post_id = remove.getAttribute('data_post_id');
                remove_post(post_id,e);
            })
        
        //make this remove as added event listener
        remove.setAttribute('added',true);
        }
    })
}


//remove the post for the given post id
function remove_post(post_id,e) {

    const post = e.target.parentNode.parentNode; 
    const token = helper.checkStore('user');
    const option = {
        method:'DELETE',
        headers:{
            'accept': 'application/json',
            'Authorization': 'Token ' + token
        }
    };

    fetch(`http://127.0.0.1:5000/post/?id=${post_id}`,option)
    .then(res => res.json())
    .then(r => {
        if(r.message === 'success') {
            //delete the post live
            post.remove();
        }else {
            alert(r.message);
        }
     })
}





//bind like when click on the like icon user like this post
function like_click() {
    const like_icons = document.querySelectorAll('.fa-thumbs-up');

    //bind each like_icon to the even listener
    like_icons.forEach(icon => {
        //check if icon already added event listener
        if(icon.getAttribute('like') === null) {
            icon.addEventListener('click', (e) => {
                //add like to this post
                const post_id = e.target.getAttribute('data_post_id');
                const user_ids = e.target.getAttribute('user_ids').split(',');
                const liked = user_ids.includes(helper.checkStore('curr_id'));

                //send the like post to theb backend
                const token = helper.checkStore('user');
                const option = {
                    method:'PUT',
                    headers:{
                        'accept': 'application/json',
                        'Authorization': 'Token ' + token
                    }
                };

                //show attach feed to large_feed
                fetch(`http://127.0.0.1:5000/post/like?id=${post_id}`,option)
                .then(res =>res.json())
                .then(r => {
                    //check if not liked yet and success on post to the backend
                    if(r.message === 'success' && !liked){
                        const like_text = icon.parentNode.children[1];
                        const regex = /[0-9]+/g;
                        let match = regex.exec(like_text.innerText);
                        let num = match[0];
                        num++; 
                        like_text.innerText = `Likes: ${num}`;

                        //append the like_text element data_likes attributes so show like will update lieve
                        const original_likes = like_text.getAttribute('data_likes')
                        const new_likes = original_likes === '' ? helper.checkStore('curr_id') : original_likes +`,${helper.checkStore('curr_id')}`;
                        like_text.setAttribute('data_likes',  new_likes );

                    } else { //if there is error alter show message
                        (r.message === 'success')? alert("Has liked Already!") : alert(r.message);     
                    } 
                 })
                .catch(err => console.log(err));
                return;

            })
            //add the attributes like inicating event listener for like added 
            icon.setAttribute('like',true);
        }
    })
    return;
}


//make user name button at the top when click will render user' profiel page
function make_user_btn() {
    const user_btn = helper.createElement('button',null,{id:'user_btn',class:'astext'});
    const name = helper.checkStore('name');
    user_btn.innerHTML = `
        <b style="font-size:x-large">${name}</b>
    `
    header.insertBefore(user_btn,header.children[1]);

    //add click event to the button will take user to their own profile page
    user_btn.addEventListener('click',() => {
        //render user profile page
        render_profile();
    })
    return;
}



//render the profile of the current user page
function render_profile(user) {
    //change the status of the user now in profile
    if(user !== undefined) {
        window.localStorage.setItem('on_profile',user);
        window.localStorage.setItem('status',2);
    }else {
        window.localStorage.setItem('status',1);
    }

    //render all the element in the header if not created
    if(document.getElementById('post_btn') === null) make_post_btn();
    
    if(document.querySelector('.astext') === null) make_user_btn();
    //update the user btn name accordingly depend on whos profile page it is 
    const user_btn = document.getElementById('user_btn').children[0];
    user_btn.innerText = (user === undefined) ? helper.checkStore('name') : user;
    ///insert the style reference link from bootstrap
   
    if(document.getElementById('bootstrap') === null) {
        const bootstrap = helper.createElement('link',null,{id:'bootstrap',href:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',rel:'stylesheet'});
        head.appendChild(bootstrap);
    }
    //create the log off button
    if(!document.getElementById('log_off')) make_log_off();

    //clear the content in large feed
    large_feed.innerHTML = '';

    //request the post from the backend
    const token = helper.checkStore('user');
    
    //depend on which user to render their profilepage
    const user_url = user === undefined ? 'http://127.0.0.1:5000/user' :  `http://127.0.0.1:5000/user/?username=${user}`;

    const option = {
        method:'GET',
        headers:{
            'accept': 'application/json',
            'Authorization': 'Token ' + token
        }
    };

    //show attach feed to large_feed
    var promises = [];
    fetch(user_url,option)
    .then(res =>res.json())
    .then(r => {
         //console.log(r);
         //get post from the given post_id
        post_ids = r.posts.reverse();
        loaded_posts =5;

        post_ids.slice(0,5).forEach(post_id => {
            //append promises to the list
            promises.push(fetch(`http://127.0.0.1:5000/post/?id=${post_id}`,option)
            .then(res => res.json())
            .catch(err => console.log(err)));

        })

        //got the post ids
        Promise.all(promises)
        .then(posts => {
            posts.forEach(post => {
               //wrap the post and put onto large_feed
               large_feed.appendChild(helper.createPostTile(post));
            })
            //modol bind likes so that when click like txt will show who likes this post
            modal_bind_like();
            //bind like when click on the like icon user like this post
            like_click();
            //when click on the comment btn will present user with the modal to input comment
            modal_bind_comment();
            //only bind the edit and delte icon on the post if the page is the login user page
            if(helper.checkStore('status') === '1') bind_edit();

         }) 
    })

    //when click on the loga return to the home page is user is logged in
    const logo = document.getElementById('logo');
    logo.addEventListener('click', () => {
        if(helper.checkStore('user') !== null) render_home();
    })
}



//to make a post button at the top of header
function make_post_btn() {
    const modal_post = document.getElementById('modal_posts');

    //make the post bottun at the top
    const post_btn = helper.createElement('button',null,{id:'post_btn',class:'btn btn-default btn-sm',type:'button'});
    post_btn.innerHTML = 'Create New Post';
    post_btn.classList.add('create_post');
    header.insertBefore(post_btn,header.children[1]);

    //when click on post will show a modal for creating new post
    post_btn.addEventListener('click', () => {
        myModal.style.display = "block";
       
        //create the post modal
        //add the description box
        const description_box = helper.createElement('form',null,{id:'post_form'});
        description_box.innerHTML = `
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea class="form-control" rows="5" id="description"></textarea>
                </div>
        `
        modal_post.appendChild(description_box);

        //add the attach file section
        const upload_btn = helper.createElement('div',null,{class:'upload-btn-wrapper'});
        upload_btn.innerHTML = `
            <button class="btn_upload">Upload a photo</button>
            <input type="file" name="myfile" />
        `
        modal_post.appendChild(upload_btn);
        
        //add post_submit button
        const post_submit = helper.createElement('button','Submit',{type:'button',class:'ubtn btn-primary btn-md'});
        post_submit.style.float ='right';
        modal_post.appendChild(post_submit); 
    
        //add the event when submit
        post_submit.addEventListener('click',() => {
            //read value from the descripton
            const description_txt = document.getElementById('description').value;
            //get value from the file input
            const file_chosen = document.querySelector('input[type="file"]');
            const [file] = file_chosen.files;

            //check if file and description are both present
            if(description_txt !== '' & file !== '') {
                //check if the upload is valid
                const result = post_post(description_txt,file);
                //live update the section if post success
                result ? alert('Post Sucess!') : alert('Can not Upload Please check');

            } else {
                alert('Please enter description and input a valid png file');
            }
        })
    })
}

//post post return true if sucess else false
function post_post(description_txt,file) {
    //send the post post request to the backend to store the post
    const photo = helper.uploadImage(file); //photo returns the reader of the file
    if(photo === false) return false;  //if upload format not right return false
    
    //if sucess read the file now can post to the back
    photo.onload = (e) =>{
        const dataurl = e.target.result;

        //post to back
        //make the post post to the backend    
        const token = helper.checkStore('user');
        const payload = {
            'description_text':description_txt,
            'src':dataurl.slice(22)
        }
    
        const option = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'accept': 'application/json',
                'Authorization': 'Token ' + token
            },
            body:JSON.stringify(payload)
        };

        //show attach feed to large_feed
        fetch(`http://127.0.0.1:5000/post/`,option)
        .then(res => res.json())
        .then(r =>  {
            //check the response and see if post to backend success
            if(r.post_id) return true;
            if(r.message) return false;

        })
        .catch(err => console.log(err));
    }
        return true;
}


//to make log off button on the user homepage
function make_log_off() {
   //add the log off button to the header
    const log_off = helper.createElement('button',null,{id:'log_off',class:'btn btn-default btn-sm',type:'button'});
    log_off.innerHTML =`<span class="glyphicon glyphicon-log-out"></span> Log out`; 
    log_off.classList.add('logout');

    //append log_off to the header
    header.appendChild(log_off);

    //when click on the log off will render log in page and clear local storage for tokens    
    log_off.addEventListener('click',() => {
        window.localStorage.clear();
        user_name ='';
        password ='';
        render_login();

        //remove the log_off button
        log_off.remove();
    }) 
    return;
}



//bind modal with the comment bton so that when click user can put comments
function modal_bind_comment() {
        const comment_btn = document.querySelectorAll('.fa-comment');
        //console.log(comment_btn);
        //click on the button on each like text to open modal
        comment_btn.forEach(element => {
            //check if already add event listenr
            if(element.getAttribute('comment_listen') === null){
                element.addEventListener('click',(e) => {
                    myModal.style.display ="block";
                    display_comment_box(e);
                })
                element.setAttribute('comment_listen',true);
            }
        })
}

function display_comment_box(e) {
   //add comments and text box with submit btn
    myModal.style.display = "block";
    const comment_btn = e.target; 
    //create the post modal
    //add the description box
    const comment_box = helper.createElement('form',null,{id:'comment_form'});
    comment_box.innerHTML = `
            <div class="form-group">
                <label for="comment">Comment:</label>
                <textarea class="form-control" rows="5" id="comment"></textarea>
            </div>
    `
    modal_posts.appendChild(comment_box);
    
    //add post_submit button
    const post_submit = helper.createElement('button','Submit',{type:'button',class:'ubtn btn-primary btn-md'});
    modal_posts.appendChild(post_submit); 

    //add submit btn click event listener
    post_submit.addEventListener('click', (e) => {
        //read value from the comment box
        const comment_text = document.getElementById('comment').value;
        (comment_text === '') ? alert('Please enter some comments') : post_comment(comment_btn,comment_text);
    })
}


//given text comment post comment to the backend
function post_comment(comment_btn,comment_text) {
    const post_id = comment_btn.getAttribute('data_post_id');
    console.log(post_id);
    const token = helper.checkStore('user');
    const time = new Date().getTime();
    const payload = {
        "author": helper.checkStore('name'),
        "published": time.toString(),
        "comment": comment_text 
        }
    console.log(payload);
    
    const option = {
        method:'PUT',
        headers:{
            'accept': 'application/json',
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload)
    };
    fetch(`http://127.0.0.1:5000/post/comment?id=${post_id}`,option)
    .then(res => res.json())
    .then(r => {
        //if suscess posted to the back end 
        console.log(r);
        if(r.message === 'success') { //update the current post append comment live
            //get the current section element
            const section  = comment_btn.parentNode.parentNode;
            console.log(section);
            section.appendChild(helper.make_comment(payload));

        } else {    //else must be some error 
            alert(r.message);
        }
     })
}


//bind modal with like text so that when click will show likes
function modal_bind_like() {
        //modal bonding like
        //onece page load add modal trigger
        const like_text = document.querySelectorAll('.like');

        //click on the button on each like text to open modal
        like_text.forEach(element => {
            //check if already add event listenr
            if(element.getAttribute('show_like') === null){
                element.addEventListener('click',(e) => {
                    myModal.style.display ="block";
                    display_like(e);
                })
                element.setAttribute('show_like',true);
            }
        })

        //click on the x to close the modal
        cross.onclick = function() {
            myModal.style.display = "none";
            //reset the modal content to its orignal content
            modal_posts.innerHTML = '';

        }
}

//to display likes onto the mortal;
function display_like(e) {
    //show the like user id
    const like_ids = (e.target.getAttribute('data_likes')).split(',');

    //given user ids return a list of user name relates to that id
    like_ids.forEach (user_id => {
        make_like_user(user_id);

    })
    return;
}


//give a user id return a user name paragraph
function make_like_user(user_id) {
    const token = helper.checkStore('user');
    const option = {
        method:'GET',
        headers:{
            'accept': 'application/json',
            'Authorization': 'Token ' + token
        }
    };

    //show attach feed to large_feed
    fetch(`http://127.0.0.1:5000/user/?id=${user_id}`,option)
    .then(res => res.json())
    .then(r => {
        //make a user name para graph and add to the modal
        modal_posts.appendChild(helper.createElement('p',r.username));
        modal_posts.appendChild(document.createElement('HR'));

     })
    .catch(err => console.log(err));
}


// to creaet a modal frame work to insert elemtn in
function make_modal() {
    const modal = helper.createElement('div',null,{id:'myModal',class:'modal'});
    modal.innerHTML = ` 
               <!-- Modal content -->
               <div class="modal-content">
                     <span class="close">&times;</span>
                     <p><b>Lets Have a Greate Day :)</b></p>
               </div>
               <div class="modal-content" id="modal_posts">
               </div>
   `
    return modal;

}


