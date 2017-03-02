import React from 'react'
import request from 'superagent'
import Radium from 'radium'
import {browserHistory} from 'react-router'
import StackGrid from 'react-stack-grid'

import Styles from './Styles'
import ResultList from './ResultList'
import DropButton from './DropButton'
import Card from './Card'
import DropDown from './DropDown'

@Radium
export default class CollectionDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            results: []
        }
    }

    stateChanged = () => {
        var self = this
        self.props.reDraw()
        // setTimeout(function() {
        //     self.props.reDraw()
        // }, 500)
    }

    deleteClassifier = (e) => {
        e.preventDefault()
        if (confirm('Delete ' + this.props.name + '?') == true) {
            var req = request.post('/api/delete_collection')
            req.query({collection_id: this.props.collectionID})
            req.query({api_key: localStorage.getItem('apiKey')})
            req.end(function(err, res) {
                browserHistory.push('/collections')
            })
        }
    }

    updateClassifier = (e) => {
        e.preventDefault()
        alert('This feature is not yet available')
        // browserHistory.push('/update_collection/'+this.props.collectionID)
    }

    onDrop = (files, rejects, onFinished, onProgress) => {
        var self = this
        var req
        self.setState({ error: null }, self.stateChanged)
        if (files == null || files.length <= 0) {
            if (rejects != null && rejects[0].size > 2 * 1024 * 1024 && (rejects[0].type == 'image/jpeg' || rejects[0].type == 'image/png') ) {
                self.setState({ error: 'Image size limit (2MB) exceeded' }, self.stateChanged)
                return
            }
            self.setState({ error: 'Invalid image file (must be .jpg or .png)' }, self.stateChanged)
            return
        }

        req = request.post('/api/similar')
        req.query({collection_id: this.props.collectionID})

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
            var results = []
            if (res.body != null && res.body.similar_images != null) {
                for (var i in res.body.similar_images) {
                    results.push(res.body.similar_images[i].metadata.image_url)
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

        var extraPadding = {
            padding: '44px 0px'
        }

        var imgStyle = {
            display: 'inline-flex',
            margin: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
        }

        var base = {
            width: '100%',
            height: '150px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            border: '1px solid #dedede',
            marginRight: '10px',
        }

        var similar = this.state.results.map(function(result) {
            return (
                <div style={base} key={result}>
                    <img src={result} style={imgStyle}/>
                </div>
            )
        })

        return(
            <Card style={{marginBottom:'20px'}}>
                <DropDown link='https://www.ibm.com/watson/developercloud/visual-recognition/api/v3/?node#find_similar' delete={this.deleteClassifier} update={this.updateClassifier}/>
                <div style={[textStyle, {marginRight: '15px', marginTop: '-5px', position: 'relative', display: 'inline-block', float: 'right'}]}>{this.props.images} images</div>
                <div style={titleStyle}>{this.props.name}</div>
                <div style={textStyle}>{this.props.collectionID}</div>
                <div style={textStyle}><div style={[status, {background: color}]}/>{this.props.status}</div>

                {/*To soothe my pain*/}
                {this.props.collectionID ? null : <div style={{height: '1em', marginTop: '2px'}}></div>}

                <div style={{width: '100%', height:'20px'}}></div>
                {this.state.error ? <div style={error}>{this.state.error}</div> : null}
                {this.props.status == 'ready' || this.props.status == 'available' ?
                    <DropButton
                        style={extraPadding}
                        id={this.props.collectionID}
                        accept={"image/jpeg, image/png"}
                        maxSize={2 * 1024 * 1024}
                        upload={true}
                        onDrop={this.onDrop}
                        text={"Drag images here to find similar ones"}
                        subtext={"choose your files"} />
                    :
                    <DropButton
                        style={extraPadding}
                        id={this.props.collectionID}
                        text={"Drag images here to find similar ones"}
                        subtext={"choose your files"}
                        disabled={true}/>
                }
                <StackGrid style={{marginTop: '10px'}} columnWidth={'20%'} gutterWidth={0} duration={0}>{similar}</StackGrid>
            </Card>
        )
    }
}
