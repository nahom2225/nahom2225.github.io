import React, { Component, useState, useEffect } from "react";
import { Grid, Typography, Card, CardActionArea, CardContent, IconButton } from "@material-ui/core";
import { ArrowUpward, ArrowDownward } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";
import { GoogleLogin } from 'react-google-login';

export default function GoogleLoginButton(props) {

    const onSuccess = (response) => {
        // Your logic after a successful Google signup
        console.log(response);
        navigate(`/frontpage`)
    };

    const onFailure = (error) => {
        // Your logic after a failed Google signup
        console.error(error);
    };

    return (
        <GoogleLogin
            clientId="174243951862-tdt9vdl01kedt82gt4mbvlnvmkgsktl1.apps.googleusercontent.com"
            buttonText={props.text}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
        />
    )
}