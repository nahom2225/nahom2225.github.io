import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AccountCard from "./AccountCard";
import PostCard from "./PostCard";
import Geocode from "react-geocode";

export default function FrontPage(props) {
    
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [account, setAccount] = useState({});
  const [posts, setPosts] = useState([{}]);
  const [page, setPage] = useState(1);
  const [locations, setLocations] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);

  Geocode.setApiKey("AIzaSyBGClyq1L6HGnnlZZsYxxoQXaqdlKgsMXY");

  useEffect(() => {
    // code to run on component mount
    fetch(`/api/get-posts/${page}/${postPerPage}`).then((response) => {
      if (!response.ok){
        console.log("OH OOHHH")          
      } else {
        response.json().then((data) => {
          setPosts(data["results"]);
          setNumberOfPosts(data["count"]);
          console.log("HERE")
          console.log(posts);
          console.log(numberOfPosts);
        })
      }
    })
    fetch('/api/get-account').then((response) => {
      if (!response.ok){
        console.log("OH OOHHH")
        props.clearAccountIdCallback();
        navigate("/");
      } else {
        response.json().then((data) => {
          setAccount(data);
          setUsername(data.username);
          //console.log(data);
        })
      }
    })
    // cleanup function to run on component unmount
    return () => {
    };
  }, [page, postPerPage, numberOfPosts]);
  
    // Geocode the addresses from the posts
    const geocodeAddresses = async () => {
      const geocodedPosts = [];
  
      for (const post of posts) {
        try {
          const response = await Geocode.fromAddress(post.location);
          const { lat, lng } = response.results[0].geometry.location;
          geocodedPosts.push({ lat, lng });
        } catch (error) {
          console.error("Error geocoding address:", error);
        }
      }
  
      return geocodedPosts;
    };
  
    useEffect(() => {
      const updateLocations = async () => {
        const coords = await geocodeAddresses();
        setLocations(coords);
      };
  
      updateLocations();
    }, [posts]);

  const MapContainer = ({ google, posts }) => {
    const mapStyles = {
      width: "50%",
      height: "50%",
    };

  
    return (
      <Map google={google} zoom={10} style={mapStyles} initialCenter={locations[0]}>
        {locations.map((location, index) => (
          <Marker key={index} position={location} />
        ))}
      </Map>
    );
  };
  

  const WrappedMapContainer = GoogleApiWrapper({
    apiKey: "AIzaSyBGClyq1L6HGnnlZZsYxxoQXaqdlKgsMXY",
  })(MapContainer);
  
  
  const handleNextPage = () => {
    setPage(page + 1 > Math.ceil(numberOfPosts/postPerPage) ? Math.ceil(numberOfPosts/postPerPage) : page + 1);
  }

  const handlePrevPage = () => {
    setPage(page - 1 <= 0 ? 1 : page - 1);
  }

  return (
    <Grid container>
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
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs = {12} sm = {3} align="center">
          <ButtonGroup>
            <Button onClick={handlePrevPage}>
              <ArrowBack />
            </Button>
            <Button onClick={handleNextPage}>
              <ArrowForward />
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs = {12} align = "center">
          <FormControl>
            <InputLabel id="Posts Per Page">Posts Per Page</InputLabel>
            <Select
              labelId="Posts Per Page"
              value={postPerPage}
              onChange={(e => setPostPerPage(e.target.value))}>
                <MenuItem value="5"> 5 </MenuItem>
                <MenuItem value="10"> 10 </MenuItem>
                <MenuItem value="25"> 25 </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} align = "center">
          <Typography variant="h6">
            {1 + (page - 1) * postPerPage} - {page * postPerPage > numberOfPosts ? numberOfPosts : page * postPerPage} of {numberOfPosts}
          </Typography>
        </Grid>   
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} align="right" className="google-maps">
            <WrappedMapContainer posts={posts} />
          </Grid>
          <Grid item xs={6} sm={3} align="left" className="posts-container">          
            {posts.map(post => (<PostCard key = {post.id} {...post} />))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

}