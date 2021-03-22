import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";

import { render } from "react-dom";
import Gallery from "react-grid-gallery";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { number_images } from "./Upload";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
}));

export default function Augment(props) {
  var images_array = [];
  const [currentImage, setImage] = useState(0);
  const [imageArray, setImageArray] = useState(images_array);
  const classes = useStyles();

  // currentImageChange(index) {
  //       this.setState({ currentImage: index });
  //   }
  const currentImageChange = (index) => {
    setImage(index);
  };
  // console.log("Number of images after axios");
  // console.log(number_images);

  for (var i = 0; i < props.images; i++) {
    images_array.push({
      img: "",
      title: i.toString(),
      author: "anjali",
    });
  }
  const togglePopup = () => {
    
  }
  const deleteImage = () => {
    if (
      window.confirm(
        `Are you sure you want to delete image number ${currentImage}?`
      )
    ) {
      var images = imageArray.slice();
      images.splice(currentImage, 1);
      setImageArray(images);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  // const fetchData = () => {
  //   axios.get(`http://localhost:5000/get-images`).then((res) => {
  //     console.log("Number of images after axios");
  //     console.log(res.data);
  //   });
  // };

  return (
    <div className={classes.root}>
      {props.images != 0 ? (
        <GridList
          cellHeight={200}
          spacing={0}
          className={classes.gridList}
          cols={8}
        >
          {imageArray.map((tile, index) => (
            <GridListTile
              key={tile.img}
              // cols={tile.featured ? 2 : 1}
              // rows={tile.featured ? 2 : 1}
            >
              <img
                onClick={togglePopup}
                src={
                  props.url +
                  index.toString() +
                  ".png" +
                  `?${new Date().getTime()}`
                }
                alt={tile.title}
                style={{ height: "200px", width: "200px" }}
              />

              {props.showDelete && (
                <GridListTileBar
                  title={tile.title}
                  titlePosition="top"
                  actionIcon={
                    <IconButton
                      onChange={currentImageChange}
                      aria-label={`star ${tile.title}`}
                      className={classes.icon}
                      onClick={deleteImage}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  actionPosition="left"
                  className={classes.titleBar}
                />
              )}
            </GridListTile>
          ))}
        </GridList>
      ) : (
        <div></div>
      )}
    </div>
  );
}
