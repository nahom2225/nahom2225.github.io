import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel} from '@material-ui/core'
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AccountCard from "./AccountCard";
import PostCard from "./PostCard";
import Geocode from "react-geocode";
import { DisabledByDefaultRounded } from "@mui/icons-material";

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
  }, []);

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
    const prevLink = document.getElementById("prev")
    const nextLink = document.getElementById("next")
    if (page == 1) {
      prevLink.classList.add('disabled')
    } else if (disabled in prevLink.classList) {
      prevLink.classList.remove('disabled')
    }

    if (page == Math.ceil(numberOfPosts/postPerPage)) {
      nextLink.classList.add('disabled')
    } else if (disabled in nextLink.classList) {
      nextLink.classList.remove('disabled')
    }
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
  
  /**
    let map;

    async function initMap(locations) {
      // The location of Uluru
      const position = locations[0];
      // Request needed libraries.
      //@ts-ignore
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    
      // The map, centered at Uluru
      map = new Map(document.getElementById("map"), {
        zoom: 11,
        center: position,
        mapId:"DEMO_MAP_ID"
      });
    
      let marker;
    
      locations.map((location, index) =>
        marker = new AdvancedMarkerElement({
        map: map,
        position: location[index],
        title: posts[index].title,
        })
      )
      // The marker, positioned at Uluru
    }
*/
    useEffect(() => {
      const updateLocations = async () => {
        const coords = await geocodeAddresses();
        setLocations(coords);
      };
  
      updateLocations();
      //initMap(locations);
    }, [posts]);

  const MapContainer = ({ google, posts }) => {
    const mapStyles = {
      width: "68%",
      height: "70%",
      margin: "0 0 0 2%",
    };

  
    return (
      <Map google={google} style = {mapStyles} zoom={10} initialCenter={locations[0]} className = "google-maps">
        {locations.map((location, index) => (
          <Marker key={index} position={location} content="{posts[index].title}"/>
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



  const handleActive = (id) => {
    const ids = ["first", "second", "third"];
    for (const other_id of ids) {
      if (other_id !== id) {
        document.getElementById(other_id).classList.remove("active");
      }
    }
    document.getElementById(id).classList.add("active");
  };

  return (
    <Grid container>
      <AppBar position="static">
        <Grid container>
          <Grid item xs = {12}>
            <Toolbar>
              <Typography variant="h4">Food Finderz</Typography>
            </Toolbar>
          </Grid>
          <Grid item xs={12} align="right">
            <AccountCard frontpage = {true} {...account}/>
          </Grid>
        </Grid>
      </AppBar>
      <Grid container justifyContent="flex-end">
        <div className = "post-control">
          <nav aria-label="...">
            <ul className="pagination">
              <li id="prev" className="page-item disabled">
                <a className="page-link" onClick={handlePrevPage}>Previous</a>
              </li>
              <li id="first" className="page-item active">
                <a className="page-link" onClick={() => handleActive("first")}>1</a>
              </li>
              <li id="second" className="page-item">
                <a className="page-link" onClick={() => handleActive("second")}>2</a>
              </li>
              <li id="third" className="page-item">
                <a className="page-link" onClick={() => handleActive("third")}>3</a>
              </li>
              <li id="next" className="page-item">
                <a className="page-link" onClick={handleNextPage}>Next</a>
              </li>
            </ul>
          </nav>
        </div>
        <Grid container className="map-posts-container">
          <Grid item xs={12} sm={6} className="google-maps">
            <WrappedMapContainer posts={posts} />
          </Grid>
          <Grid item xs={12} sm={3} className="posts-container">          
            {posts.map(post => (<PostCard key = {post.id} {...post} />))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

}

//<WrappedMapContainer posts={posts} />
/*
          <Grid item xs = {12} sm = {12} className="posts-per-page">
            <FormControl className="posts-per-page">
              <InputLabel id="Posts Per Page">Posts Per Page</InputLabel>
              <Select className="posts-per-page"
                labelId="Posts Per Page"
                value={postPerPage}d
                onChange={(e => setPostPerPage(e.target.value))}>
                  <MenuItem value="5"> 5 </MenuItem>
                  <MenuItem value="10"> 10 </MenuItem>
                  <MenuItem value="25"> 25 </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs = {12} sm = {12} justifyContent="right">
            <ButtonGroup>
              <Button onClick={handlePrevPage}>
                <ArrowBack />
              </Button>
              <Button onClick={handleNextPage}>
                <ArrowForward />
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} sm = {12}>
            <Typography variant="h6" align = "center">
              {1 + (page - 1) * postPerPage} - {page * postPerPage > numberOfPosts ? numberOfPosts : page * postPerPage} of {numberOfPosts}
            </Typography>
          </Grid>   
*/