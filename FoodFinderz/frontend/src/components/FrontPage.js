import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import AccountCard from "./AccountCard";

export default function FrontPage(props) {
    
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

  return (
    <AppBar position="static">
      <Grid container>
        <Grid item xs = {12} sm = {3}>
          <Toolbar>
            <Typography variant="h4">Food Finderz</Typography>
          </Toolbar>
        </Grid>
        <Grid item xs={12} sm={9} align="right">
          <AccountCard frontpage = {true} {...account}/>
        </Grid>
      </Grid>
    </AppBar>
  );

}