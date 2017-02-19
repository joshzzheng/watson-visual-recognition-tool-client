import React from 'react'
import request from 'superagent'
import {browserHistory} from 'react-router'
import CollectionDetail from './CollectionDetail'
import Button from './Button'
import Radium from 'radium'
import StackGrid from 'react-stack-grid'

@Radium
export default class Collections extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collections: []
        }
    }

    loadCollectionsFromServer = () => {
        alert('This feature is incomplete and not yet live')
        var self = this

        var req = request.post('/api/list_collections')
        req.query({ api_key: localStorage.getItem('apiKey') })

        req.end(function(err, res) {
            console.log(res)
            var collections = []
            if (err != null) {
                console.error('Server error')
            }
            if (res.body != null) {
                if (res.body.statusInfo == 'invalid-api-key') {
                    console.error('Invalid API Key')
                    self.props.invalidApiKey()
                    return
                } else if (res.body.status == 'ERROR') {
                    console.error('There was an error fetching collections')
                }
                collections = res.body.collections
                collections.sort(function(a, b) {
                    return new Date(b.created) - new Date(a.created)
                })
            }
            self.setState({ collections: collections })
        })
    }

    onClick = () => {
        alert('This feature is not yet available')
        // browserHistory.push('/create_collection')
    }

    componentDidMount() {
        this.loadCollectionsFromServer()
    }

    // Important!
    componentWillReceiveProps(newProps) {
        this.loadCollectionsFromServer()
    }

    reDraw = () => {
        this.forceUpdate()
    }

    render() {
        var self = this
        var collections = this.state.collections.map(function(collection) {
            return (
                <CollectionDetail
                    host={self.props.route.host}
                    collectionID={collection.collection_id}
                    name={collection.name}
                    status={collection.status}
                    reDraw={self.reDraw}
                    key={collection.collection_id || collection.name}/>
            )
        })
        return (
            <div>
                <div style={{margin: '21px 0px'}}>
                    <Button text={"Create collection"} kind={"bold"} icon={"/btn_create.png"} onClick={this.onClick}/>
                </div>
                <StackGrid columnWidth={300} gutterWidth={40}>{collections}</StackGrid>
            </div>
        )
    }
}
