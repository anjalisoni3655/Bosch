import React, { Component } from 'react';
import './App.css';
// import Sidebar from './Components/Sidebar/Sidebar';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import {FaGem, FaHeart} from 'react-icons/fa';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import testComponent from './test';
import Upload2 from './Components/Upload';

const styleSidebar = {
  height : "80%",
};
const routes = [
  {
    path: "/",
    exact: true,
    component: testComponent,
  },
  {
    path: "/bubblegum",
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: "/shoelaces",
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
];

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: {
        textfield1: '',
        textfield2: '',
        select1: 1,
        select2: 1,
        select3: 1
      },
      result: ""
    };
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }

  handlePredictClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isLoading: true });
    fetch('http://127.0.0.1:5000/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => {
        this.setState({
          result: response.result,
          isLoading: false
        });
      });
  }

  handleCancelClick = (event) => {
    this.setState({ result: "" });
  }

  render() {
    const isLoading = this.state.isLoading;
    const formData = this.state.formData;
    const result = this.state.result;

    return (
      <Router>
        {/* <ProSidebar>
          <Menu iconShape="square">
            <MenuItem icon={<FaGem />}>
              <Link to="/">Dashboard</Link>
            </MenuItem>
            <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
            <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
            <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
            <MenuItem icon={<FaGem />}>Dashboard</MenuItem>                       
          </Menu>
        </ProSidebar> */}
        <ProSidebar style={styleSidebar} className="sidebar">
          <SidebarHeader>
            {/**
             *  You can add a header for the sidebar ex: logo
             */}
          </SidebarHeader>
          <SidebarContent>
            <Menu>
              <MenuItem icon={<FaGem />}>
                  Dashboard
                  <Link to="/"></Link>
                </MenuItem>
                <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
                <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
                <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
                <MenuItem icon={<FaGem />}>Dashboard</MenuItem>                       
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            {/**
             *  You can add a footer for the sidebar ex: copyright
             */}
          </SidebarFooter>
        </ProSidebar>        
        <Switch> 
              <Route exact path='/' component={Upload2}></Route> 
              {/* <Route exact path='/about' component={}></Route> 
              <Route exact path='/contact' component={}></Route>  */}
            </Switch> 
        </Router>  
    );
  }
}

export default App;