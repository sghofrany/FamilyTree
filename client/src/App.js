import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Person from './Person'
import View from './View'
import { v4 as uuidv4 } from 'uuid'


function App() {

  return (
    <Router>
      <div className="App">
       
       <Switch>
         <Route path="/" exact component={Person} />
         {/* <Route path="/:id" component={View} /> */}
        <Route path="/:id" render={({match}) => <View key={uuidv4()} match={match} />} />
       </Switch>

      </div>
    </Router>
   
  );
}

export default App;
