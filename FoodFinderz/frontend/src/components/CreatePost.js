import React, { Component, useState, useEffect } from "react";
import { Grid, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, IconButton, LinearProgress, Box, Collapse} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate } from "react-router-dom";
import Autocomplete from 'react-google-autocomplete';
import { useParams, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
import {withRouter} from "./withRouter";
import AccountCard from "./AccountCard";
import Divider from '@mui/material/Divider'
import Button from "@mui/material/Button";
import Alert from "@material-ui/lab/Alert";
import { Title } from "@material-ui/icons";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

export default function CreatePost(props) {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [account, setAccount] = useState({});
    const [title, setTitle] = useState("");
    const [food, setFood] = useState("");
    const [locationData, setLocationData] = useState({});
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [locationOptions, setLocationOptions] = useState([]);
  
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

    function handleCreatePostButtonPressed() {        
        console.log('title:', title);
        console.log('food:', food);
        console.log('location:', locationData.label);
        console.log('description:', description);
        console.log('username:', username);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                title : title, 
                food : food,
                location : locationData.label,
                description : description,
                account_poster : username,                
            }),
        };
        fetch("/api/create-post", requestOptions)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setError("");
                    navigate(`/frontpage`);
                    console.log(data);})
            } else if (response.status === 409 || response.status === 400) {
                response.json().then((data) => {
                    setError(data.error);
                    console.log(data.error);});
                    console.log(response.statusText);                    
            }
        })
        .catch((error) => {
            console.log(error);
            setError(error)
        });
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
            <Grid item xs = {12} algin = "center">
                <Collapse in = {error != ""}>
                    <Alert severity="error" onClose={() => {setError("")}}>
                        {error}
                    </Alert>
                </Collapse>
            </Grid>
            </AppBar>
            <div className = "topmidleft">
            <Grid container style={{ gap: 15 }}>
                <Grid item xs = {12}>
                    <Typography variant="h5"> Create a Post! </Typography>
                </Grid>
                <Grid item xs = {12}>
                    <Divider variant = "fullWidth" sx={{ borderBottomWidth: 5, width:"840px"}}/>
                </Grid>
                <Grid item xs = {12} > 
                    <Card className = "card">
                        <Grid container style = {{ gap : 10 }}>
                            <Grid item xs = {12}>
                                <TextField
                                    error={null}
                                    label=""
                                    placeholder="Title"
                                    value={title}
                                    helperText={null}
                                    variant="outlined"
                                    onChange={(e) => {setTitle(e.target.value)
                                                    console.log(locationData.label);}}
                                    inputProps={{
                                        style: {
                                            width: "600px",                                            
                                        },
                                        maxLength: 50
                                        }}
                                />
                                <Typography variant = "h6">
                                {title.length} / 50
                                </Typography>
                            </Grid>
                            <Grid item xs = {12}>
                                <TextField
                                    error={null}
                                    label=""
                                    placeholder="Food"
                                    value={food}
                                    helperText={null}
                                    variant="outlined"
                                    onChange={(e) => {setFood(e.target.value)}}
                                    inputProps={{
                                        style: {
                                            width: "550px",                                                                    
                                        },
                                        maxLength: 50
                                        }}
                                />
                                <Typography variant = "h6">
                                {food.length} / 50
                                </Typography>
                            </Grid>
                            <Grid item xs = {9}>
                                <GooglePlacesAutocomplete
                                    apiKey = "AIzaSyBGClyq1L6HGnnlZZsYxxoQXaqdlKgsMXY"
                                        selectProps={{
                                            locationData,
                                            onChange: setLocationData,
                                        }}
                                    />
                            </Grid>
                            <Grid item xs = {12}>
                                <TextField
                                    multiline
                                    rows={9}
                                    maxRows={10}
                                    error={null}
                                    label=""
                                    placeholder="Description (Optional)"
                                    value={description}
                                    helperText={null}
                                    variant="outlined"
                                    onChange={(e) => {setDescription(e.target.value)}}
                                    inputProps={{
                                        style: {
                                            width: "800px",                                            
                                        },
                                        maxLength: 2000
                                        }}
                                />
                                <Typography variant = "h6">
                                {description.length} / 2000
                                </Typography>
                            </Grid>
                            <Grid item xs = {12} container justifyContent="flex-end">
                                <Grid item>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={handleCreatePostButtonPressed}
                                        className = "card.button">
                                        Post
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>                
            </Grid>
            </div>
        </div>
      );
}

/**
<TextField
error={null}
label=""
placeholder="Title"
value={title}
helperText={null}
variant="outlined"
onChange={(e) => {setTitle(e.target.value)}}
inputProps={{
    style: {
        width: "550px",
    },
    maxLength: 50
    }}                                        
/>
**/

/**
<Autocomplete
    options={locationOptions}
    getOptionLabel={(option) => option.description}
    inputValue={location}
    onChange={(event, value) => {
        handleLocationInputChange(event, value);}}
    renderInput={(params) => (<TextField {...params} label="Location" variant="outlined" />)}
    renderOption={(option) => <Typography>{option.description}</Typography>}
/>
{error && (
    <Alert severity="error" onClose={() => setError("")}>
        {error}
    </Alert>
    )}
    <Typography variant = "h6">
    {title.length} / 50
    </Typography>
**/
