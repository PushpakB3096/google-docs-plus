import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { v4 as uuid } from "uuid";
import TextEditor from "./components/TextEditor.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          {/* when user comes to the homepage, redirect them to a new document with a random ID */}
          <Redirect to={`/documents/${uuid()}`} />
        </Route>
        <Route path='/documents' exact>
          <Redirect to={`/documents/${uuid()}`} />
        </Route>
        <Route path='/documents/:id'>
          <TextEditor />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
