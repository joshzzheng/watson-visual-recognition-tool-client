import React from 'react'
import Radium from 'radium'
import {browserHistory} from 'react-router'
import request from 'superagent'
import Styles from './Styles'
import TitleCard from './TitleCard'
import Button from './Button'
import Class from './Class'
import ProgressModal from './ProgressModal'
import ReactDOM from 'react-dom'

@Radium
export default class CreateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifierName: '',
            classes: [
                {negative: true, file: null},
                {name: '', file: null},
            ],
            errors: false,
            upload: false,
        }
    }

    onTextChange = (text) => {
        this.setState({ classifierName: text.target.value })
    }

    setClassFile = (file, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].file = file
        this.setState({ classes: newClasses })
    }

    setClassName = (text, key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses[key].name = text.target.value
        this.setState({ classes: newClasses })
    }

    deleteClass = (key) => {
        var newClasses = $.extend([], this.state.classes)
        newClasses.splice(key, 1)
        this.setState({classes: newClasses})
    }

    cancel = () => {
        browserHistory.push('/')
    }

    errorCheck = () => {
        var self = this

        if (this.state.classifierName == null) {
            self.setState({errors: true})
            return
        }

        var validClasses = 0
        this.state.classes.map(function(c) {
            if (c.file != null) {
                name = c.name
                if (c.negative) {
                    name = 'NEGATIVE_EXAMPLES'
                } else if (name == null) {
                    self.setState({errors: true})
                    return
                }
            } else {
                self.setState({errors: true})
                return
            }
            validClasses++
        })

        if (validClasses < 2) {
            self.setState({errors: true})
            return
        }

        self.setState({upload: true})
    }

    // This is kind of messy but helps show progress faster
    create = (onProgress, onFinished) => {
        var req = request.post('/api/create_classifier')
        var self = this

        this.state.classes.map(function(c) {
            name = c.name
            if (c.negative) {
                name = 'NEGATIVE_EXAMPLES'
            }
            req.attach('files', c.file[0], name)
        })

        req.query({ api_key: localStorage.getItem('apiKey') })

        req.query({ name: this.state.classifierName })

        req.on('progress', function(e) {
            if (e.direction == 'upload') {
                onProgress(e.percent)
            }
        })

        req.then(function(res, err) {
            console.log(res)
            onFinished()
            self.setState({upload: false})
            browserHistory.push('/')
        })
    }

    addClass = (e) => {
      var newClasses = $.extend([], this.state.classes)
      newClasses.push({
        name: "",
        file: null
      })
      this.setState({classes: newClasses});
    }

    onDrop = (files) => {
        var self = this
        this.setState({ files: files }, function() {
            this.props.onDrop(this.state.files, function() {
                self.setState({ files: [] })
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
            }
        }

        var margin = {
            marginTop: '5px',
        }

        var self = this
        return (
            <div>
                <div style={[textStyles.header, {marginTop: '30px', marginBottom: '5px'}]}>
                    Create a new classifier
                </div>
                <div style={[textStyles.base, {marginTop: '5px', marginBottom: '18px'}]}>
                    A classifier is a group of classes that are trained against each other. This allows you identify highly specialized subjects.
                </div>
                <TitleCard
                    errors={self.state.errors}
                    default={this.state.classifierName}
                    placeholder='Classifier name'
                    onChange={this.onTextChange}
                    inputStyle={textStyles.header}>
                    <div className='row' style={{marginTop: '10px'}}>{this.state.classes.map(function(c, i) {
                        return (
                            <Class
                                errors={self.state.errors}
                                negative={c.negative}
                                default={c.name}
                                style={{maxWidth:'30rem'}}
                                key={i}
                                id={i}
                                setClassFile={self.setClassFile}
                                setClassName={self.setClassName}
                                delete={self.deleteClass}/>
                        )
                    })}</div>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.addClass} text='Add class' style={{float: 'left'}}/>
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
