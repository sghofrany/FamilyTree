import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Person from './Person';
import View from './View';

function App() {

  return (
    <Router>
      <div className="App">
       
       <Switch>
         <Route path="/" exact component={Person} />
         <Route path="/:id" component={View} />
       </Switch>

      </div>
    </Router>
   
  );
}

export default App;
