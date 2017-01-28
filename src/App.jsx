import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Base from './components/Base'
import Classifiers from './components/Classifiers'
import CreateClassifier from './components/CreateClassifier'

class App extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Base}>
                    <IndexRoute component={Classifiers}/>
                    <Route path="/collections" component={Classifiers}/>
                    <Route path="/create" component={CreateClassifier}/>
                </Route>
            </Router>
        )
    }
}

ReactDOM.render(
    <App />, document.getElementById("main")
)
