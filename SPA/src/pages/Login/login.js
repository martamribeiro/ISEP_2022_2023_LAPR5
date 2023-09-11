import './style.css';
import React, { useState, useEffect  } from "react";
import Camiao from './camiao.svg';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from "gapi-script";
import { sendRequest } from './Controllers/loginController';

const Login = () => {
    const[password,setPassword] = useState('');
    const[userInput,setUserInput] = useState('');
    let email;
    let username;

    function togglePasswordVisibilty(){
        let passwordVisibility = document.getElementById("inputPassword");

        if(passwordVisibility.type === "password"){
            passwordVisibility.type = "text";
        }else{
            passwordVisibility.type = "password";
        }
    }

    function isEmail() {
        if(userInput.includes("@")){
            email = userInput;
            return true;
        }else{
            username = userInput;
            return false;
        }
    }

    function getUser(){

        let path;
        let isItEmail = isEmail();


        if(isItEmail === true){
            path = '/porEmail/' + email;
        }else{
            path = '/porUsername/' + username;
        }

        sendRequest(path, true, password);

        //console.log(localStorage.getItem('userToken'));
    }

    const onFailure = (response) => {
        console.log("Failure");
        console.log(response);
      };
    
    async function onSuccess (response) {
        console.log("success");
        console.log(response.profileObj.email);

        let path = '/porEmail/' + response.profileObj.email;

        sendRequest(path, false, "");
    };

    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: "496316879853-gkrabr1rj65egov9er2gqlruml0p5k87.apps.googleusercontent.com",
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);

    return(
        <main>
            <div className="main-login">
                <div className="left-login">
                    <h1>Welcome to ElectricGo!<br></br></h1>
                    <img src={Camiao} className="left-login-image" alt="Camiao animaçao"></img>
                </div>
                <div className="right-login">
                    <div className="card-login">
                        <h1>LOGIN</h1>
                        <div className="textfield-login">
                            <input type="text" name="utilizador" placeholder="Utilizador ou E-Mail" onChange={(e=>setUserInput(e.target.value))}></input>
                        </div>
                        <div className="textfield-login">
                            <input id="inputPassword"type="password" name="senha" placeholder="Senha" onChange={(e=>setPassword(e.target.value))}></input>
                        </div>
                        <button className="btn-login" onClick={getUser}>Login</button>
                        <GoogleLogin
                            clientId="496316879853-gkrabr1rj65egov9er2gqlruml0p5k87.apps.googleusercontent.com"
                            buttonText="Login With Google Account"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                        />
                        <div className="checkbox-password-login">
                            <input type="checkbox" onClick={togglePasswordVisibilty}/>Show Password
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;