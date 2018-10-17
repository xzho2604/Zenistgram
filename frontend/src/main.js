// importing named exports we use brackets
import * as helper  from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

//my code============================================================
fetch('http://localhost:8080/data/users.json')
    .then(response => response.json())
    .then(r => console.log(r)) //need to do another then since hte .json will retunr a promise
    .catch(err => console.log(err));

const large_feed = document.getElementById('large-feed');

//create the css 
const form_control_css = document.createElement('style');
form_control_css.textContent = `.form-control {
    display: block;
    width: 100%;
    height: 34px;
    font-size: 14px;
    line-height: 1.42857;
    color: rgb(191, 191, 191);
    background-color: rgb(26, 26, 26);
    background-image: none;
    box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset;
    padding: 6px 0px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(77, 77, 77);
    border-image: initial;
    border-radius: 4px;
    transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
}`

//log in form format css
const login_form = document.createElement('style');
login_form.textContent = `.login-form {
    margin-bottom: 15px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 2px;
    background: rgb(33, 33, 33);
    padding: 30px;
}`

//css for the div that encapsulate the form
const body_form_css = document.createElement('style');
body_form_css.textContent = `.form-body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.42857;
    color: rgb(191, 191, 191);
}`

console.log(body_form_css);
//adding the style into the body
large_feed.appendChild(form_control_css);
large_feed.appendChild(login_form);
large_feed.appendChild(body_form_css);


//creat an dive for form body stype that encapsulate the form
const body_form = helper.createElement('div',null,{class:'form-body'});

//create a user login form
const form = helper.createElement('form',null,{class:'login-form',method:'post'});
form.style.cssText = 'width: 340px;margin: 50px auto';

//header
const log_head = helper.createElement('h2','Log In');
log_head.style.cssText = 'text-align:center';
form.appendChild(log_head);

//form group div ---------for user name
const form_div = helper.createElement('div');
form_div.style.cssText = 'margin-bottom: 15px';

//input test
const input_user = helper.createElement('input',null,{class:'form-control',type:'text',placeholder:'User Name',required:'required'});
form_div.appendChild(input_user);
form.appendChild(form_div);

//form group div ---------for password
const form_div2 = helper.createElement('div');
form_div.style.cssText = 'margin-bottom: 15px';

//input text 
const input_password = helper.createElement('input',null,{class:'form-control',type:'password',placeholder:'Password',required:'required'});
form_div2.appendChild(input_password);
form.appendChild(form_div2);

body_form.appendChild(form)
large_feed.appendChild(body_form);

//my code============================================================

// we can use this single api request multiple times
const feed = api.getFeed();

feed
.then(posts => {
    posts.reduce((parent, post) => {

        parent.appendChild(helper.createPostTile(post));
        
        return parent;

    }, document.getElementById('large-feed'))
});

// Potential example to upload an image
const input = document.querySelector('input[type="file"]');

input.addEventListener('change', helper.uploadImage);

