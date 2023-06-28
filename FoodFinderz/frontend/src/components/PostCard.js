import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, CardActionArea, CardContent} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AccountCard from "./AccountCard";
import { makeStyles } from '@material-ui/core/styles';

export default function PostCard(props) {

    const navigate = useNavigate();
    
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
    }));

    const classes = useStyles();

    function handleClick() {
        navigate(`/frontpage/` + props.post_id);
    } 


    return(
        <Card className={classes.postCard}>
            <CardActionArea onClick = {handleClick}>
                <CardContent>
                    <Typography>
                        Poster: {props.account_poster}
                    </Typography>
                    <Typography>
                        Title: {props.title}
                    </Typography>
                    <Typography>
                        Food: {props.food}
                    </Typography>
                    <Typography>
                        Location: {props.location}
                    </Typography>
                    <Typography>
                        Description: {props.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )

}