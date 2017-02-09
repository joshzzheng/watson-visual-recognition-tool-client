import React from 'react'
import request from 'superagent'
import Radium from 'radium'
import {browserHistory} from 'react-router'

import Styles from './Styles'
import ResultList from './ResultList'
import DropButton from './DropButton'
import Card from './Card'
import DropDown from './DropDown'

@Radium
export default class CollectionDetail extends React.Component {
    stateChanged = () => {
        this.props.reDraw()
    }

    deleteClassifier = (e) => {
        e.preventDefault()
        if (confirm('Delete ' + this.props.name + '?') == true) {
            var req = request.post('/api/delete_classifier')
            req.query({classifier_id: this.props.collectionID})
            req.query({api_key: localStorage.getItem('apiKey')})
            req.end(function(err, res) {
                browserHistory.push('/')
            })
        }
    }

    updateClassifier = (e) => {
        e.preventDefault()
        browserHistory.push('/update/'+this.props.collectionID)
    }

    onDrop = (files, onFinished, onProgress) => {
        var self = this
        var req
        self.setState({ error: null }, self.stateChanged)
        if (this.props.collectionID == null && this.props.name == 'Faces') {
            req = request.post('/api/detect_faces')
        } else {
            req = request.post('/api/classify')
            req.query({classifier_ids: [this.props.collectionID]})
            req.query({threshold: 0.0})
        }

        if (files[0]) {
            req.attach('file', files[0])
        }

        req.query({api_key: localStorage.getItem('apiKey')})

        req.on('progress', function(e) {
            console.log(e.direction + ' Percentage done: ' + e.percent)
            if (e.direction == 'upload') {
                onProgress(e.percent / 2)
            } else if (e.direction == 'download') {
                if (e.percent < 100) {
                    onProgress(50 + e.percent / 2)
                }
            }
        })

        req.end(function(err, res) {
            onProgress(100)
            console.log(res)
            var results
            if (res.body != null && res.body.images != null) {
                if (res.body.images[0].classifiers != null && res.body.images[0].classifiers.length > 0 ) {
                    results = res.body.images[0].classifiers[0].classes
                    results.sort(function(a, b) {
                        return b.score - a.score
                    })
                } else if (res.body.images[0].faces != null && res.body.images[0].faces.length > 0) {
                    results = res.body.images[0].faces[0]
                } else if (res.body.images[0].error != null) {
                    console.error(res.body.images[0].error.description)
                    if (res.body.images[0].error.description == 'Image size limit exceeded (2935034 bytes > 2097152 bytes [2 MiB]).') {
                        self.setState({ error: 'Image size limit (2MB) exceeded' }, self.stateChanged)
                    } else {
                        self.setState({ error: res.body.images[0].error.description }, self.stateChanged)
                    }
                }
            } else if (res.body.code == 'LIMIT_FILE_SIZE') {
                self.setState({ error: 'Image size limit (2MB) exceeded' }, self.stateChanged)
            } else {
                console.error(err)
                console.error('failed to classify')
                var error = 'Invalid image file (must be .jpg or .png)'
                self.setState({ error: error }, self.stateChanged)
            }
            self.setState({ file: files[0], results: results }, self.stateChanged)
            onFinished()
        })
    }

    render() {
        var textStyle = {
            paddingTop: '5px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: Styles.colorTextLight,
            font: Styles.fontDefault,
        }

        var titleStyle = {
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: Styles.colorTextDark,
            font: Styles.fontHeader,
        }

        var status = {
            marginBottom: '-1px',
            marginRight: '5px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '5px',
        }

        var error = {
            paddingBottom: '10px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        var color
        if (this.props.status == 'available') {
            color = '#64dd17'
        } else if (this.props.status == 'training'){
            color = '#ffab00'
        } else {
            color = '#F44336'
        }

        return(
            <Card style={{maxWidth:'30rem'}}>
                <DropDown delete={this.deleteClassifier} update={this.updateClassifier}/>
                <div style={titleStyle}>{this.props.name}</div>
                <div style={textStyle}>{this.props.collectionID}</div>
                <div style={textStyle}><div style={[status, {background: color}]}/>{this.props.status}</div>

                {/*To soothe my pain*/}
                {this.props.collectionID ? null : <div style={{height: '1em', marginTop: '2px'}}></div>}

                <div style={{width: '100%', height:'20px'}}></div>
                {this.state.error ? <div style={error}>{this.state.error}</div> : null}
                <DropButton
                    upload={true}
                    onDrop={this.onDrop}
                    text={"Drag images here to classify them"}
                    subtext={"choose your files"} />
                {this.state.results ? <ResultList file={this.state.file} results={this.state.results}/> : null}
            </Card>
        )
    }
}
