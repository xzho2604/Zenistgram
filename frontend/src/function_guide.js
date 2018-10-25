//render user the loggin page and add event listener to login and sign up
function render_login() 

//take in user name and password to see if the user is valid
//if valid will store the returned token in the local storage else print error message
function validate_user (name, pass) 

//render logged in user home plage where display feeds that user has followed
//add event listener to the like btn , comment btn and like number
function render_home() 

//add event listener to like btn so that when user click on like ,will post
//like to the backend if succeed will update the like numbers live
function like_click() 

//to show the user name at the top of the page when login 
//add event listener to the user btn so that when click will render back user home page
function make_user_btn() 

//render the user's profile page 
//add event listener of like and comments like home page
function render_profile() 

//make a create post button at the top of the page
//add event listner so that when click will show modal for upload photo add descrition and submit
function make_post_btn() 

//post the post to the backend
//return true if succeed retunr false if not
function post_post(description_txt,file) 

//make the log off button on the user homepepage
//add event listener when click on the log off will log off user return to the log in page clear localstorage
function make_log_off() 

//add event listener to the comment btn so that when click will render the comment modal
function modal_bind_comment() 

//will display the comment_box of the modal
//add event listener to the submit btn to submit the comments to the backend
function display_comment_box(e) 

//given the post id and comment content post the comment to the backend
//upoon succeed will update the curent section with the comments else will show the error message
function post_comment(comment_btn,comment_text) 

//add event listenr to the like text so that when click will show the modal of who like this post
function modal_bind_like() 

//givent the ids of users like this post will display modals of users like this post
function display_like(e) 

//give a user id return a user name paragraph element
function make_like_user(user_id)

//create a modal frame work to dynamically insert element in and display
function make_modal() 

