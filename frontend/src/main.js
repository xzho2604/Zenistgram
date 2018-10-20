// importing named exports we use brackets
import * as helper  from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';


//my code============================================================
const large_feed = document.getElementById('large-feed');
const head = document.querySelector('head');
let user_name = '';
let  password ='';

//insert create modal on to the page
const header =document.querySelector('.banner'); 
header.appendChild(make_modal());

//set modal default display none
const myModal = document.getElementById('myModal');
var cross = document.getElementsByClassName("close")[0];
myModal.style.display ="none";

//add like button css
const like_css = helper.createElement('link',null,{rel:'stylesheet',href:'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'});
head.appendChild(like_css);

/*
//add js for modal
const modal_jq = helper.createElement('script',null,{src:'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'});
const modal_js = helper.createElement('script',null,{src:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'});
head.appendChild(modal_jq);
head.appendChild(modal_js);
*/


//render the login page
render_login();


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
                        window.localStorage.setItem(input_user.value,r.token); 
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
                window.localStorage.setItem(name,r.token); 
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
    
    ///insert the style reference link from bootstrap
    const bootstrap = helper.createElement('link',null,{href:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',rel:'stylesheet'});
    head.appendChild(bootstrap);

    //remove the login form
    large_feed.innerHTML ='';


    //unhide the attach photo section
    const attach = document.querySelector('.nav');
    attach.style.display = 'block';
    attach.children[1].remove();
    attach.children[1].remove();


    //get user's feed from the data base and render as user's home page
    const token = helper.checkStore(user_name);
    const option = {
        method:'GET',
        headers:{
            'accept': 'application/json',
            'Authorization': 'Token ' + token
        }
    };


    //show attach feed to large_feed
    fetch('http://127.0.0.1:5000/user/feed',option)
    .then(res =>res.json())
    .then(r => {
        r.posts.forEach(post => {
            large_feed.appendChild(helper.createPostTile(post));
        })

        //modal bonding like
        //onece page load add modal trigger
        const like_text = document.querySelectorAll('.like');

        //click on the button on each like text to open modal
        like_text.forEach(element => {
            element.addEventListener('click',() => {
                myModal.style.display ="block";
                display_like();
            })
        })

        //click on the x to close the modal
        cross.onclick = function() {
            myModal.style.display = "none";
        }



    });

}



//to display likes onto the mortal;
function display_like() {
    return;
}






// to creaet a modal frame work to insert elemtn in
function make_modal() {
    const modal = helper.createElement('div',null,{id:'myModal',class:'modal'});
    modal.innerHTML = ` 
               <!-- Modal content -->
               <div class="modal-content">
                     <span class="close">&times;</span>
                     <p>Some text in the Modal..</p>
               </div>
   `
    return modal;

}


