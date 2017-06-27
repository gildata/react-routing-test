import React, {Component} from 'react';


import { DatePicker } from 'antd';

// import 'antd/lib/date-picker/style/index.css';

// style-loader!css-loader

import 'antd/dist/antd.css';

class Sidebar extends Component {
    
  render() {
    return (
        <DatePicker />
    );
  }
}

export default Sidebar;
