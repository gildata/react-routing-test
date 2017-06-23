import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

const TestRouters = () => (
    <div>
        <Router>
            <div>
                <h2>xxxxxxxxx</h2>
                <ul>
                    <li><Link to="/netflix">Netflix</Link></li>
                    <li><Link to="/zillow-group">Zillow Group</Link></li>
                    <li><Link to="/yahoo">Yahoo</Link></li>
                    <li><Link to="/modus-create">Modus Create</Link></li>
                </ul>
                <h2>Route</h2>
                <Route path="/:id" component={Child} />
            </div>
        </Router>
    </div>
);

const Child = ({ match }) => (
    <div>
        <h1>match: {match}</h1>
        <h2>match.params: {match.params}</h2>
        <h3>match.params.id: {match.params.id}</h3>
    </div>
);

export default TestRouters;