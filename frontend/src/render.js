import{large_feed} from './main.js';

import * as helper  from './helpers.js';
//render login page
export function render_login() {
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
