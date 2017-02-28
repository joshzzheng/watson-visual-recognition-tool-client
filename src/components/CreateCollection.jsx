import React from 'react'
import Radium from 'radium'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
import request from 'superagent'
import Styles from './Styles'
import TitleCard from './TitleCard'
import Button from './Button'
import ProgressModal from './ProgressModal'
import DropButton from './DropButton'

@Radium
export default class CreateCollection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collectionName: '',
            errors: false,
            upload: false,
        }
    }

    onTextChange = (text) => {
        this.setState({ collectionName: text.target.value })
    }

    onDrop = (file) => {
        this.setState({ file: file })
    }

    cancel = () => {
        browserHistory.push('/')
    }

    errorCheck = () => {
        var self = this
        self.setState({errors: false}, function() {
            var errors = this.state.errors
            if (this.state.collectionName == null || this.state.collectionName == '') {
                errors = true
                self.setState({errors: errors, titleError: true})
            } else {
                self.setState({titleError: false})
            }

            if (this.state.file == null) {
                errors = true
                self.setState({errors: errors})
                return
            }

            if (!errors) {
                self.setState({upload: true})
            }
        })
    }

    // This is kind of messy but helps show progress faster
    create = (onProgress, onFinished) => {
        var req = request.post('/api/create_collection')
        var self = this

        console.log(this.state.file[0])

        req.attach('files', this.state.file[0], 'collection')

        req.query({ api_key: localStorage.getItem('apiKey') })

        req.query({ name: this.state.collectionName })

        req.on('progress', function(e) {
            if (e.direction == 'upload') {
                console.log(e.percent)
                onProgress(e.percent)
            }
        })

        req.then(function(res, err) {
            console.log(res)
            onFinished()
            self.setState({upload: false}, function() {
                browserHistory.push('/collections')
            })
        })
    }

    render() {
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            header: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
            },
            title: {
                color: Styles.colorTextDark,
                font: Styles.fontTitle,
            }
        }

        var margin = {
            marginTop: '5px',
        }

        var titleError = {
            paddingBottom: '10px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        var extraPadding = {
            padding: '44px 0px',
            marginBottom: '10px',
        }

        var error = {
            paddingTop: '5px',
            paddingLeft: '10px',
            textDecoration:'none',
            display:'block',
            whiteSpace:'nowrap',
            overflow:'hidden',
            textOverflow:'ellipsis',
            color: '#F44336',
            font: Styles.fontDefault,
        }

        const RGB=Styles.colorPrimary
        const A='0.1'
        const RGBA='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')'
        const A2='0.3'
        const RGBA2='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A2+')'

        var self = this
        return (
            <div>
                <div style={[textStyles.header, {marginTop: '30px', marginBottom: '5px'}]}>
                    Create a new collection
                </div>
                <div style={[textStyles.base, {marginTop: '5px', marginBottom: '18px'}]}>
                    A collection CHANGE ME.
                </div>

                {self.state.titleError ? <div style={titleError}>Collection name is required</div> : null}
                <TitleCard
                    errors={self.state.errors}
                    placeholder='Collection name'
                    title={self.state.collectionName}
                    onChange={this.onTextChange}
                    inputStyle={textStyles.title}>
                    <DropButton
                        accept={'application/zip'}
                        maxSize={100 * 1024 * 1024}
                        style={extraPadding}
                        errors={this.props.errors}
                        text='Drag .zip here to create collection'
                        subtext='choose your file'
                        onDrop={this.onDrop}
                        clear={true}/>

                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.cancel} text='Cancel' style={{marginRight: '20px'}}/>
                        <Button onClick={this.errorCheck} text='Create' kind='bold'/>
                    </div>
                </TitleCard>
                {this.state.upload ?
                    <ProgressModal
                        load={this.create}/>
                    : null
                }
            </div>
        )
    }
}
