import React, { Component } from 'react';

import Sidebar from './Sidebar.jsx';


const styles = {
    border: "1px solid red",
    color: "#0f0"
};



class Home extends Component {
    render(){
        return(
            <div>
                <div style={styles}>
                    <Sidebar/>
                </div>
                <h1>Home Page</h1>
            </div>
        );
    }
}

export default Home;