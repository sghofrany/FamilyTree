import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import FrontPage from './FrontPage'
import View from './View'

function App() {

  return (
    <Router>
      <div className="App">
       
       <Switch>
         <Route path="/" exact component={FrontPage} />
         <Route path="/:id" render={(props) => <View {...props} key={props.match.params.id} />} />
       </Switch>
       
      </div>
    </Router>
   
  );
}

export default App;
