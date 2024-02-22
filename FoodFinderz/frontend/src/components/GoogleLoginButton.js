import React, { Component, useState, useEffect } from "react";
import { Grid, Typography, Card, CardActionArea, CardContent, IconButton } from "@material-ui/core";
import { ArrowUpward, ArrowDownward } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";
import { GoogleLogin } from 'react-google-login';

export default function GoogleLoginButton(props) {

    useEffect(() => {
        // Dynamically create a link element for Google Sign-In CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://accounts.google.com/gsi/style.css';
        document.head.appendChild(link);
    
        // Cleanup: Remove the link element when the component is unmounted
        return () => {
          document.head.removeChild(link);
        };
      }, []);

    const onSuccess = (googleUser) => {
        // Your logic after a successful Google signup
        console.log(googleUser);
        
        // Redirect to the desired page (e.g., "/frontpage")
        navigate('/frontpage');
    };
    
    const onFailure = (error) => {
        // Your logic after a failed Google signup
        console.error(error);
    };


    return (
        <div>
            <div id="g_id_onload"
                data-client_id="174243951862-tdt9vdl01kedt82gt4mbvlnvmkgsktl1.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback={onSuccess}  // Use curly braces to pass the function as a callback
                data-auto_prompt="false">
            </div>
        
            <div className="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="filled_blue"
                data-text={props.text}
                data-size="large"
                data-logo_alignment="left"
                data-width="40">
            </div>
        </div>
    );
}

/*
        <GoogleLogin
            clientId="174243951862-tdt9vdl01kedt82gt4mbvlnvmkgsktl1.apps.googleusercontent.com"
            buttonText={props.text}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
        />
*/