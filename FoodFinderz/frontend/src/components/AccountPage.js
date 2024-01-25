import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AccountCard from "./AccountCard";
import PostCard from "./PostCard";
import Geocode from "react-geocode";
import { Loader } from "@googlemaps/js-api-loader"
import { DisabledByDefaultRounded } from "@mui/icons-material";

export default function AccountPage(props) {
    
  const navigate = useNavigate();

  const { username } = useParams();
  const [account, setAccount] = useState({});
  const [posts, setPosts] = useState([{}]);



  Geocode.setApiKey("AIzaSyBGClyq1L6HGnnlZZsYxxoQXaqdlKgsMXY");

  useEffect(() => {
    // code to run on component mount
    fetch('/api/get-account').then((response) => {
      if (!response.ok){
        //props.clearAccountIdCallback();
        navigate("/login");
      } else {
        response.json().then((data) => {
          setAccount(data);
          if (data.username != username) {
            console.log("INVALID ACCESS")
            navigate(`/`);
          } else {
            console.log("PROPER ACCESS")
          }
        })
      }
    })
    // cleanup function to run on component unmount
    return () => {
    };
  }, []);

  

  return (
    <Grid container>
      <AppBar position="static">
        <Grid container alignItems="center">
          <Grid item xs = {6}>
            <Toolbar>
              <Typography variant="h4">Food Finderz</Typography>
            </Toolbar>
          </Grid>
          <Grid item xs={6} align="right">
            <AccountCard frontpage = {true} {...account}/>
          </Grid>
        </Grid>
      </AppBar>
    </Grid>
  );

}

