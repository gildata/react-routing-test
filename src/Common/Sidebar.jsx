import React, {Component} from 'react';


import { DatePicker } from 'antd';

import 'antd/lib/date-picker/style.css'; 

class Sidebar extends Component {
    
  render() {
    return (
      <DatePicker />
    );
  }
}

export default Sidebar;
