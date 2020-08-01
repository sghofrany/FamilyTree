import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Person from './Person'
import View from './View'
import { v4 as uuidv4 } from 'uuid'


function App() {

  return (
    <Router>
      <div className="App">
       
       <Switch>
         <Route path="/" exact component={Person} />
         <Route path="/:id" render={(props) => <View {...props} key={uuidv4()} />} />
       </Switch>
       
      </div>
    </Router>
   
  );
}

export default App;
