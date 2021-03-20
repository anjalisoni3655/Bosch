import React, { useState }from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

var IMAGES = [];

 for (var i = 0; i < 8; i++) {
  IMAGES.push({
    img: "../assets/uploaded/" + i.toString() + ".jpg",
    title: i.toString(),
    author: "anjali",
  });
 }

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "200%",
    height: 450,
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

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *     featured: true,
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export default function Augment() {
  const [currentImage, setImage] = useState(0);
  const[imageArray,setImageArray]=useState(IMAGES)
  const classes = useStyles();
  // currentImageChange(index) {
  //       this.setState({ currentImage: index });
  //   }
  const currentImageChange = (index) => {
    setImage(index);
    
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
  }

  return (
    <div className={classes.root}>
      <GridList cellHeight={300} spacing={1} className={classes.gridList}>
        {imageArray.map((tile,index) => (
          <GridListTile
            key={tile.img}
            cols={tile.featured ? 2 : 1}
            rows={tile.featured ? 2 : 1}
          >
            <img src={require("../assets/uploaded/"+index.toString()+".jpg")} alt={tile.title} />
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
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
