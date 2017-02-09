import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Base from './components/Base'
import Classifiers from './components/Classifiers'
import Collections from './components/Collections'
import CreateClassifier from './components/CreateClassifier'
import UpdateClassifier from './components/UpdateClassifier'

class App extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Base}>
                    <IndexRoute component={Classifiers}/>
                    <Route path="/collections" component={Collections}/>
                    <Route path="/create" component={CreateClassifier}/>
                    <Route path="/update">
                        <Route path="/update/:classifierID" component={UpdateClassifier}/>
                    </Route>
                </Route>
            </Router>
        )
    }
}

ReactDOM.render(
    <App />, document.getElementById("main")
)
