import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import Base from './components/Base'
import Classifiers from './components/Classifiers'
import CreateClassifier from './components/CreateClassifier'
import UpdateClassifier from './components/UpdateClassifier'
import Collections from './components/Collections'
import CreateCollection from './components/CreateCollection'
import UpdateCollection from './components/UpdateClassifier'

class App extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Base}>

                    {/*Classifiers*/}
                    <IndexRoute component={Classifiers}/>
                    <Route path="/create_classifier" component={CreateClassifier}/>
                    <Route path="/update_classifier">
                        <Route path="/update_classifier/:classifierID" component={UpdateClassifier}/>
                    </Route>

                    {/*Collections*/}
                    <Route path="/collections" component={Collections}/>
                    <Route path="/create_collection" component={CreateCollection}/>
                    <Route path="/update_collection">
                        <Route path="/update_collection/:collectionID" component={UpdateCollection}/>
                    </Route>

                </Route>
            </Router>
        )
    }
}

ReactDOM.render(
    <App />, document.getElementById("main")
)
