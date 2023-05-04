import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AccountCard from "./AccountCard";
import PostCard from "./PostCard";

export default function FrontPage(props) {
    
  const navigate = useNavigate();

  const[username, setUsername] = useState('');
  const[account, setAccount] = useState({});
  const[posts, setPosts] = useState([{}]);
  const[page, setPage] = useState(1);
  const[numberOfPosts, setNumberOfPosts] = useState(1);
  const postPerPage = 23;


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
  


  const handleNextPage = () => {
    setPage(page + 1 > Math.ceil(numberOfPosts/postPerPage) ? Math.ceil(numberOfPosts/postPerPage) : page + 1);

    /*
    fetch(`/api/get-posts?page=${page}`).then((response) => {
      if (!response.ok){
        console.log("OH OOHHH")
      } else {
        response.json().then((data) => {
          setPosts(data);
          setNumberOfPosts(posts.length);
          console.log(data);
        })
      }
    })
    */
  }

  const handlePrevPage = () => {
    setPage(page - 1 <= 0 ? 1 : page - 1);
    
    /*
    fetch(`/api/get-posts?page=${page}`).then((response) => {
      if (!response.ok){
        console.log("OH OOHHH")
      } else {
        response.json().then((data) => {
          setPosts(data);
          setNumberOfPosts(posts.length);
          console.log(data);
        })
      }
    })
    */
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
        <Grid item xs={12} align = "center">
          <Typography variant="h6">
            {1 + (page - 1) * postPerPage} - {page * postPerPage > numberOfPosts ? numberOfPosts : page * postPerPage} of {numberOfPosts}
          </Typography>
        </Grid>   
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs = {12} sm = {3} align = "center" className = "posts-container">          
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

}

//{posts.map(post => (<PostCard key = {post.id} {...post} />))}