import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, IconButton, LinearProgress, Box} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
import {withRouter} from "./withRouter";
import AccountCard from "./AccountCard";
import Divider from '@mui/material/Divider'

export default function CreatePost(props) {

    const navigate = useNavigate();

    const[username, setUsername] = useState('');
    const[account, setAccount] = useState({});
  
  
    useEffect(() => {
      // code to run on component mount
      fetch('/api/get-account').then((response) => {
        if (!response.ok){
          console.log("OH OOHHH")
          props.clearAccountIdCallback();
          navigate("/");
        } else {
          response.json().then((data) => {
            setAccount(data);
            setUsername(data.username);
            console.log(data);})
        }})
      // cleanup function to run on component unmount
      return () => {
      };
    }, []);

    var cardStyle = {
        display: 'block',
        width: '50vw',
        transitionDuration: '0.3s',
    }

    return (
        <div>
            <AppBar position="static">
            <Grid container>
                <Grid item xs = {12} sm = {3}>
                <Toolbar>
                    <Typography variant="h4"> Food Finderz</Typography>
                </Toolbar>
                </Grid>
                <Grid item xs={12} sm={9} align="right">
                <AccountCard frontpage = {false} {...account}/>
                </Grid>
            </Grid>
            </AppBar>
            <div className = "topmidleft">
            <Grid container  align = "left" style={{ gap: 15 }}>
                <Grid item xs = {12}>
                    <Typography variant="h5"> Create a Post! </Typography>
                </Grid>
                <Grid item xs = {12}>
                    <Divider variant = "fullWidth" sx={{ borderBottomWidth: 5, width:"840px"}}/>
                </Grid>
                <Grid item xs = {12} > 
                    <Card style = {cardStyle}>
                        <Grid container align = "left" style = {{ gap : 10 }}>
                            <Grid item xs = {12}>
                                <TextField
                                    error={null}
                                    label=""
                                    placeholder="Title"
                                    value={null}
                                    helperText={null}
                                    variant="outlined"
                                    onChange={() => {}}
                                    inputProps={{
                                        style: {
                                            width: "600px",
                                        },
                                        }}
                                />
                            </Grid>
                            <Grid item xs = {12}>
                                <TextField
                                    error={null}
                                    label=""
                                    placeholder="Food"
                                    value={null}
                                    helperText={null}
                                    variant="outlined"
                                    onChange={() => {}}
                                    inputProps={{
                                        style: {
                                            width: "600px",
                                        },
                                        }}
                                />
                            </Grid>
                            <Grid item xs = {12}>
                                <TextField
                                    error={null}
                                    label=""
                                    placeholder="Location"
                                    value={null}
                                    helperText={null}
                                    variant="outlined"
                                    onChange={() => {}}
                                    inputProps={{
                                        style: {
                                            width: "600px",
                                        },
                                        }}
                                />
                            </Grid>
                            <Grid item xs = {12}>
                                <TextField
                                    error={null}
                                    label=""
                                    placeholder="Description (Optional)"
                                    value={null}
                                    helperText={null}
                                    variant="outlined"
                                    onChange={() => {}}
                                    inputProps={{
                                        style: {
                                            width: "840px",
                                        },
                                        }}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            </div>
        </div>
      );
}