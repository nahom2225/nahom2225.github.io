import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, CardActionArea, CardContent} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AccountCard from "./AccountCard";
import { makeStyles } from '@material-ui/core/styles';

export default function PostCardView(props) {

    const { post_id } = useParams();

    useEffect(() => {
        // code to run on component mount
        console.log(post_id)
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                post_id : post_id,
            }),
        };
        fetch("/api/get-post-info", requestOptions)
        .then((response) => {
            if (response.ok) {
                response.json()
                .then((data) => {console.log(data);})
            } else if (response.status === 409) {
                response.json().then((data) => {setError(data.error)
                    console.log(data.error);});
                    console.log(response.statusText);
                    console.log("409")
            
            } else if (response.status === 404) {
                response.json().then((data) => {setError(data.error);
                    console.log(data.error);});
                    console.log(response.statusText);
                    console.log("404")
            }
        })
        // cleanup function to run on component unmount
        return () => {
        };
      }, []);

}