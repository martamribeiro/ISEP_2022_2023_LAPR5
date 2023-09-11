const LOGOUT_GOOGLE_URL = "https://mail.google.com/mail/u/0/?logout&hl=en";

export function logout(){
    localStorage.removeItem('userToken');
    window.location.replace("/");
}