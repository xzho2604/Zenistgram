// importing named exports we use brackets
import * as helper  from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

//my code============================================================
const large_feed = document.getElementById('large-feed');
let user_name ='';
let password = '';


fetch('http://localhost:8080/data/users.json')
    .then(response => response.json())
    .then(r => r) //need to do another then since hte .json will retunr a promise
    .catch(err => console.log(err));


//render the login page
render_login();


//check user name and password
console.log(user_name);






//my code============================================================

// we can use this single api request multiple times
/*
const feed = api.getFeed();
feed
.then(posts => {
    posts.reduce((parent, post) => {
        parent.appendChild(helper.createPostTile(post));
        return parent;
    }, document.getElementById('large-feed'))
});
*/



// Potential example to upload an image
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', helper.uploadImage);



//========================Functions===============================================
//render login page
function render_login() {
    //hide the attach phto section
    const attach = document.querySelector('.nav');
    attach.style.display = 'none';

    //hide the footer
    const footer = document.querySelector('footer');
    footer.style.display = 'none';

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
    const input_user = helper.createElement('input',null,{class:'form-con',type:'text',placeholder:'User Name',required:'required'});
    form_div.appendChild(input_user);
    form.appendChild(form_div);

    //form group div ---------for password
    const form_div2 = helper.createElement('div');
    form_div2.style.cssText = 'margin-bottom: 15px';

    //input text 
    const input_password = helper.createElement('input',null,{class:'form-con',type:'password',placeholder:'Password',required:'required'});
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
        validate_user(user_name,password) ? render_home() : alert("Wrong user name or Password!");
    });

    //user click on sign up
    sign_btn.addEventListener('click',(e) => {
        return;
    });

}


//will take in user name and password return 1 if valid 0 if not
function validate_user (name, pass) {
    //clear the text of input

    const form = document.querySelector('form');
    form.reset();
    return 1;

}

//will render home page once the user login
function render_home() {
    ///insert the style reference link from bootstrap
    const bootstrap = helper.createElement('link',null,{href:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',rel:'stylesheet'});
    large_feed.appendChild(bootstrap);

    //remove the login form
    large_feed.innerHTML ='';

    //unhide the attach photo section
    const attach = document.querySelector('.nav');
    attach.style.display = 'block';

    //show attach feed to large_feed
    const feed = api.getFeed();


    /*
    //sort the feed json in reverse chronoical order
    feed = feed.sort((a,b) => {
        const a_time = a.meta.published;
        const b_time = b.meta.published;

        //a_time:"published": "Sat Aug 04 2018 20:20:12 GMT+1000 (Australian Eastern Standard Time)"



    })
    */

    feed
    .then(posts => {
        posts.reduce((parent, post) => {
            parent.appendChild(helper.createPostTile(post));
            return parent;
        }, document.getElementById('large-feed'))
    });




}


