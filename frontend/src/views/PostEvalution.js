import React from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import GroupedSelect from "./customDropdown";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Lightbox from "react-awesome-lightbox";

// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import { CardMedia } from "@material-ui/core";

class PostEvaluation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        
      data1:{
        
        model_types: [],
      },

      data2: {
        cmData: [],
        model_behavior1: "",
        dataset_changes: "",
        network_changes: "",
        suggestions: "",
      },

      model_type: "",
      hide: true,
      opencmcm: false,
      openla: false

    };
  }

    componentWillMount() {
      axios.get(`http://localhost:5000/post-evaluation`).then((res) => {
        console.log(res.data);
        this.setState({ data1: res.data });
        console.log("Model Types", this.state.data1.model_types);
      });
    }

  render(){
    
    const columns: ColDef[] = [
      { field: 'pred', headerName: 'Predicted Class', width: 250 },
      { field: 'act', headerName: 'Actual Class', width: 250},
      { field: 'num', headerName: 'Number of Mis-Classifications', width:261},

    ];
    
    const rows = this.state.data2.cmData
    
    return (
      <div className="content" >
        <div style = {{justifyContent: "center", textAlign: "center", alignItems: "center"}}>

          <Autocomplete
            id="debug"
            options={this.state.data1.model_types}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            value={this.state.model_type}
            onChange={(event, newValue) => {
              if (newValue){
                this.setState({
                  model_type: newValue});
                  console.log("New Value: ", newValue)
                  axios.post(`http://localhost:5000/post-evaluation`, {newValue}).then(
                    (response) => {
                      this.setState({data2: response.data});
                      console.log(this.state.data2);
                    }
                    )
                    this.setState({hide: false})
                  };
                }}
            renderInput={(params) => (
              <TextField {...params} label="Choose Model" variant="outlined" />
            )}
          />
        </div>
        <div style = {{textAlign: "center"}}>
          <h4>
            {/* {this.state.model_type} */}
          </h4>
        </div>
        <br />
        <br />
        {(this.state.hide == false) ? 
          <div>
            <Row  >
              <Col lg="12" >
                <Card className="card-user" >
                  <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Confusion Matrix Analysis
                    </h4>
                  </CardTitle>
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        <img style = {{cursor: "zoom-in"}}  src={`http://localhost:5000/static/models/` + this.state.model_type.title + `/cm.png`}
                          onClick = {(event) => {
                            this.setState({opencm: true})
                          }} 
                        />
                        {(this.state.opencm == true)?<Lightbox image={`http://localhost:5000/static/models/` + this.state.model_type.title + `/cm.png`} title="Confusion Matrix" onClose={(event) => {
                            this.setState({opencm: false})
                          }} > </Lightbox>: null}
                      
                      
                      </Col>
                      <Col md = "1">
                      </Col>
                      <br />
                      <br />

                      
                        <Col md="6" xs="7">
                          <br />
                          <DataGrid rows={rows} columns={columns} autoHeight={true} scrollbarSize={0} hideFooter= {true} disableSelectionOnClick={true} disableExtendRowFullWidth={true} pageSize={5} />
                        </Col>
                     
                    </Row>
                  </CardBody>
                  <CardFooter>
                    {/* <hr />
                    <div className="stats">
                            <i className="fas fa-sync-alt" /> Update Now
                          </div> */}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card className="card-user">
                  <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Loss Accruacy Curve Analysis
                    </h4>
                  </CardTitle>
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                      <img style = {{cursor: "zoom-in"}} src={`http://localhost:5000/static/models/` + this.state.model_type.title + `/loss_acc.gif`}
                          onClick = {(event) => {
                            this.setState({openla: true})
                          }} 
                        />
                        {(this.state.openla == true)?<Lightbox image={`http://localhost:5000/static/models/` + this.state.model_type.title + `/loss_acc.gif`} title="Confusion Matrix" onClose={(event) => {
                            this.setState({openla: false})
                          }} > </Lightbox>: null}
                      
                      </Col>
                      <Col md="8" xs="7">
                        
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    {/* <hr />
                    <div className="stats">
                            <i className="fas fa-sync-alt" /> Update Now
                          </div> */}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card className="card-user">
                  <CardTitle className = "card-category" style = {{textAlign: "center"}}>
                    <h4>
                      Suggestions
                    </h4>
                  </CardTitle>
                  <CardBody>
                    <Row>
                      <Col md="4" xs="5">
                        
                      </Col>
                      <Col md="8" xs="7">
                        
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    {/* <hr />
                    <div className="stats">
                            <i className="fas fa-sync-alt" /> Update Now
                          </div> */}
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div> : null}  
      
      </div>

    )
  }
        
        
}
        
export default PostEvaluation;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

// const DialogContent = withStyles((theme) => ({
//   root: {
//     padding: theme.spacing(2),
//   },
// }))(MuiDialogContent);

// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);

// export default function CustomDialog() {
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div className="content">
//       <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//         Open dialog
//       </Button>
//       <GroupedSelect></GroupedSelect>
//       <Dialog
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={open}
//       >
//         <DialogTitle id="customized-dialog-title" onClose={handleClose}>
//           Modal title
//         </DialogTitle>
//         <DialogContent dividers>
//           <img
//             src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-pink-watercolor-brushes-png-image_5054156.jpg"
//             alt="some image"
//           ></img>
//           <Typography gutterBottom>
//             Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
//             dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
//             ac consectetur ac, vestibulum at eros.
//           </Typography>
//           <Typography gutterBottom>
//             Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
//             Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
//             auctor.
//           </Typography>
//           <Typography gutterBottom>
//             Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
//             cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
//             dui. Donec ullamcorper nulla non metus auctor fringilla.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button autoFocus onClick={handleClose} color="primary">
//             Save changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
