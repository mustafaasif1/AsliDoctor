import React from "react";
import styled from "styled-components";

import Avatar from "react-avatar";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
import Button from '@material-ui/core/Button';



import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';



const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    background: "#20B2AA",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});




const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
   return (
    promiseInProgress && 
    <div
          style={{
            width: "100%",
            // height: "100",
           display: "flex",
           justifyContent: "center",
            alignItems: "center"
          }}
       >
          <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
       </div>
  );  
}


const Docs = (props) => {

  const Title = styled.h2`
    color: #000;
    font-weight: 300;
    margin: 6px 0;
  `;
  

  const ActionButton = styled.button`
    margin: 0 5px;
    padding: 8px 14px;
    background: #37bc9b;
    color: #fff;
    cursor: pointer;
    border: 1px solid #fff;
    border-radius: 20px;
    outline: 0;
    font-weight: 300;
    :hover {
      opacity: 0.8;
    }
  `;

  var divStyle = {
    background: "#eee",
    padding: "20px",
    margin: "20px",
    display: "flex",
  };

  const [open, setOpen] = React.useState(false);
  const [openn, setOpenn] = React.useState(false);
  const [name, setName] = React.useState("");
  const [addReview, setAddReview] = React.useState("");
  const [reviews, setReviews] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);

  const classes = useStyles();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddReviewChange = (e) => {
    setAddReview(e.target.value);
  };
  const handleClickOpenn = () => {
    
    //setLoading(true);
    axios
      .get("/reviews", {
        params: { reg: "/.*" + props.person.reg + ".*/i" },
      })
      .then((res) => {
        setReviews(res.data);
        //setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
    setOpenn(true);
  };

  const handleClosen = () => {
    setOpenn(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (name !== "" && addReview !== "") {
      axios
        .post("/rate", {
          name: name.trim(),
          review: addReview,
          reg: props.person.reg,
          display: false
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    }
    setOpen(false);
  };

  React.useEffect(()=>{
    var email = localStorage.getItem('loggedIn')
    if (email != '' && email != undefined && email!=null) {
      if (email.length>5){
      setLoggedIn(true);
      
      }
    }

  }, []);
  

  return (
    <div style={divStyle}>
      <Avatar name={props.person.Name} size="100" round={true} />
      <div style={{ padding: " 0px 20px" }}>
        <Title>Name: {props.person.Name}</Title>
        <Title>Registration Number: {props.person.reg}</Title>
        <Title>City: {props.person.City}</Title>
        <Title>Gender: {props.person.Gender}</Title>
        <Title>Fathers name: {props.person["Father Name"]}</Title>
        <Title>Type: {props.person.type}</Title>
        <div>
          {/* <ActionButton style={{margin: "10px"}}>0 Reviews</ActionButton> */}

          <ActionButton style={{ margin: "10px" }} onClick={handleClickOpenn}>
            {props.person.reviews} Reviews
          </ActionButton>
          <Dialog
            fullScreen
            open={openn}
            onClose={handleClosen}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClosen}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  Reviews of {props.person.Name}
                </Typography>
              </Toolbar>
            </AppBar>
           
            <div>
              {reviews.map((i) => (
                <div style={divStyle}>
                  <Avatar name={i.name} size="100" round={true} />
                  <div style={{ padding: " 0px 20px" }}>
                    <Title>Name: {i.name}</Title>
                    <Title>Review: {i.review}</Title>
                    
                  </div>
                  
                </div>
              ))}
            </div>
          </Dialog>
          
          {/* This is where you can allow the user to write a review if he is signed In*/}

          { loggedIn && 
            <ActionButton onClick={handleClickOpen}>
            Add a new Review
            </ActionButton>
          }
          
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Have you had an encounter with {props.person.Name}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Write a review about your experience with this doctor below
              </DialogContentText>
              <div style={{ padding: "15px" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Your Name"
                  type="text"
                  fullWidth
                  color="teal"
                  onChange={handleNameChange}
                  value={name}
                />
              </div>
              <div>
                <TextField
                  style={{ padding: "0px 15px" }}
                  autoFocus
                  margin="dense"
                  id="review"
                  label="Your Review"
                  type="text"
                  onChange={handleAddReviewChange}
                  value={addReview}
                  fullWidth
                />
              </div>
            </DialogContent>
            <DialogActions>
              <ActionButton style={{ margin: "10px" }} onClick={handleClose}>
                Submit Review
              </ActionButton>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default Docs;
