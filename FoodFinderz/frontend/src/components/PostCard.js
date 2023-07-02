import React, { Component, useState, useEffect } from "react";
import { Grid, Typography, Card, CardActionArea, CardContent, IconButton } from "@material-ui/core";
import { ArrowUpward, ArrowDownward } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    postCard: {
        color: theme.palette.primary.main,
        '&:hover': {
        border: '3px solid #3f51b5',
        borderRadius: '4px',
        boxShadow: 'none'
        },
        border: '2px solid gray',
        borderRadius: '10px',
    },
    postContent: {
        paddingLeft: theme.spacing(0),
        flexGrow: 1,
    },
    voteContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        padding: theme.spacing(1),
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
    },
    upVoteButton: {
        color: theme.palette.primary.main,
        '&:hover': {
        backgroundColor: theme.palette.primary.light,
        },
    },
    downVoteButton: {
        color: theme.palette.primary.main,
        '&:hover': {
        backgroundColor: theme.palette.secondary.light,
        },
    }
}));

export default function PostCard(props) {
  const navigate = useNavigate();
  const classes = useStyles();

  const[votes, setVotes] = useState(props.votes)

  useEffect(() => {
    // code to run on component mount

    // cleanup function to run on component unmount
    return () => {
    };
  }, [votes]);

  function handleClick() {
    navigate(`/frontpage/${props.post_id}`);
  }

  function handleUpVote() {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            post_id : props.post_id               
        }),
    };
    fetch(`/api/post-vote/${1}`, requestOptions).
    then((response) => {
        if (!response.ok){
          console.log("OH OOHHH")          
        } else {
          response.json().then((data) => {
            setVotes(data["votes"]);
          })
        }})
  }

  function handleDownVote() {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            post_id : props.post_id               
        }),
    };
    fetch(`/api/post-vote/${0}`, requestOptions).
    then((response) => {
        if (!response.ok){
          console.log("OH OOHHH")          
        } else {
          response.json().then((data) => {
            setVotes(data["votes"]);
          })
        }})
  }

  return (
    <Card className={classes.postCard}>
      <Grid container>
        <Grid item xs = {2} className={classes.voteContainer}>
          <IconButton onClick={handleUpVote} className = {classes.upVoteButton}>
            <ArrowUpward />
          </IconButton>
          <Typography>{votes}</Typography>
          <IconButton onClick={handleDownVote} className = {classes.downVoteButton}>
            <ArrowDownward />
          </IconButton>
        </Grid>
        <Grid item xs = {10} className={classes.postContent}>
          <CardActionArea onClick={handleClick}>
            <CardContent>
              <Typography>Poster: {props.account_poster}</Typography>
              <Typography>Title: {props.title}</Typography>
              <Typography>Food: {props.food}</Typography>
              <Typography>Location: {props.location}</Typography>
              <Typography>Description: {props.description}</Typography>
            </CardContent>
          </CardActionArea>
        </Grid>
      </Grid>
    </Card>
  );
}
