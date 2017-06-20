import React, { Component } from 'react';

import Sidebar from './Sidebar.jsx';


class Home extends Component {
    render(){
        return(
            <div>
                <Sidebar/>
                <h1>Home Page</h1>
            </div>
        );
    }
}

export default Home