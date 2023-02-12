import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, IconButton, LinearProgress} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
import {withRouter} from "./withRouter";
import HomeIcon from '@material-ui/icons/Home';


export default withRouter(AccountCard);

function AccountCard(props) {

    const navigate = useNavigate();

    const useStyles = makeStyles((theme) => ({
    logoutButton: {
        color: theme.palette.primary.main,
        '&:hover': {
        backgroundColor: theme.palette.primary.light,
        },
    },
    }));

    const classes = useStyles();

    const handleLogout = () => {
        console.log(props.username);
        fetch('api/logout', { method: 'GET' })
        .then(response => {
          if (response.ok) {
            console.log('User logged out successfully');
            navigate(`/`);
            // You can redirect the user to the login page or display a message
          } else {
            console.log('An error occurred while logging out');
          }
        })
        .catch(error => console.log(error));
    };

    return(
        <Card style={{width: '300px', height: '100%', right: 3}}>
            <Grid container alignItems = "center">
                <Grid item align = "center" xs = {12}>
                    <Typography>
                        {props.username}
                    </Typography>
                </Grid>
                <Grid item align = "center" xs = {6}>
                    <IconButton onClick={() => {props.frontpage ? navigate('/create-post') : navigate('/frontpage')}} className = {classes.logoutButton}>
                        {props.frontpage ? <CreateIcon color="success"/> : <HomeIcon color = "success"/>}
                    </IconButton>
                </Grid>
                <Grid item align = "center" xs = {6}>
                    <IconButton onClick={handleLogout} className = {classes.logoutButton}>
                        <ExitToAppIcon color="success"/>
                    </IconButton>
                </Grid>
            </Grid>
        </Card>
    )

}

