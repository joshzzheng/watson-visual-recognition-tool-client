import React from 'react'
import Radium from 'radium'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
import request from 'superagent'
import Styles from './Styles'
import TitleCard from './TitleCard'
import Button from './Button'
import Class from './Class'
import ProgressModal from './ProgressModal'
import StackGrid from 'react-stack-grid';

var myNum = 2

@Radium
export default class UpdateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifierName: '',
            classes: [
                {negative: true, file: null, id: 0}
            ],
            errors: false,
            upload: false,
        }
    }

    componentDidMount() {
        var self = this
        var newClasses = $.extend([], this.state.classes)
        var req = request.post('/api/classifier_details')

        req.query({ api_key: localStorage.getItem('apiKey') })
        req.query({ classifier_id: this.props.params.classifierID })

        req.end(function(err, res) {
            if (err != null) {
                console.error('Server error')
            }
            if (res.body != null) {
                self.setState({classifierName: res.body.name})
                res.body.classes.map(function(c) {
                    newClasses.push({
                        name: c.class,
                        file: null,
                        id: myNum,
                        defaultClass: true,
                    })
                    myNum++
                })
            }
            self.setState({classes: newClasses})
        })
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
        self.setState({errors: false, error: null}, function() {
            var errors = this.state.errors
            var validClasses = 0

            var totalbytes = 0
            this.state.classes.map(function(c) {
                if (c.file != null) {
                    totalbytes += c.file[0].size
                }

                if (c.negative || c.defaultClass) {
                     if (c.file != null) {
                         validClasses++
                     }
                     return
                }
                if (c.name == null || c.name == '') {
                    errors = true
                    self.setState({errors: errors})
                    return
                }
                if (c.file == null) {
                    errors = true
                    self.setState({errors: errors})
                    return
                }
                validClasses++
            })

            var error = null

            var dupes = {}
            var classCount = 0
            this.state.classes.map(function(c) {
                if (c.name != null && c.name != '') {
                    dupes[c.name] = 1
                    classCount++
                }
                if (/[*\\|{}$/'`"\-]/.test(c.name)) {
                    errors = true
                    var invalidChars = c.name.match(/[*\\|{}$/'`"\-]/g)
                    error = 'Invalid characters: ' + invalidChars.join(' ')
                    self.setState({errors: errors, error: error})
                }
            })

            console.log(Object.keys(dupes).length + ' / ' + classCount)
            if (Object.keys(dupes).length < classCount) {
                errors = true
                error = 'Multiple classes have the same name.'
                self.setState({errors: errors, error: error})
                return
            }

            console.log('total size: ' + totalbytes / (1000 * 1000) + 'MB')
            console.log('valid: ' + validClasses)

            if (totalbytes / (1000 * 1000) > 256) {
                errors = true
                error = 'The service accepts a maximum of 256 MB per training call.'
                self.setState({errors: errors, error: error})
                return
            }

            if (validClasses < 1) {
                errors = true
                error = 'You must modify or add at least one class.'
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
        var req = request.post('/api/update_classifier')
        var self = this

        this.state.classes.map(function(c) {
            if (c.file != null) {
                name = c.name
                if (c.negative) {
                    name = 'NEGATIVE_EXAMPLES'
                }
                req.attach('files', c.file[0], name)
            }
        })

        req.query({ api_key: localStorage.getItem('apiKey') })

        req.query({ classifier_id: this.props.params.classifierID })

        req.on('progress', function(e) {
            if (e.direction == 'upload') {
                console.log(e.percent)
                onProgress(e.percent)
            }
        })

        req.then(function(res, err) {
            console.log(res)
            if (res.body == null) {
                alert('An error occurred while processing your request.');
            }
            onFinished()
            self.setState({upload: false})
            browserHistory.push('/')
        })
    }

    addClass = (e) => {
      var newClasses = $.extend([], this.state.classes)
      newClasses.push({
        name: "",
        file: null,
        id: myNum
      })
      myNum++
      this.setState({classes: newClasses})
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

        var self = this
        return (
            <div>
                <div style={[textStyles.header, {marginTop: '30px', marginBottom: '5px'}]}>
                    Update classifier
                </div>
                <div style={[textStyles.base, {marginTop: '5px', marginBottom: '18px'}]}>
                    A classifier is a group of classes that are trained against each other. This allows you to identify highly specialized subjects.
                </div>
                <TitleCard
                    errors={self.state.errors}
                    placeholder='Classifier name'
                    title={self.state.classifierName}
                    fixedTitle={true}
                    onChange={this.onTextChange}
                    inputStyle={textStyles.header}>
                    {self.state.error ? <div style={error}>{self.state.error}</div> : null}
                    <StackGrid columnWidth={292} gutterWidth={40} style={{marginTop: '10px'}}>{this.state.classes.map(function(c, i) {
                        return (
                            <Class
                                errors={self.state.errors}
                                negative={c.negative}
                                title={c.name}
                                fixedTitle={c.defaultClass}
                                style={{maxWidth:'30rem'}}
                                key={c.id}
                                id={i}
                                setClassFile={self.setClassFile}
                                setClassName={self.setClassName}
                                delete={self.deleteClass}/>
                        )
                    })}</StackGrid>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.addClass} text='Add class' style={{float: 'left'}}/>
                        <Button onClick={this.cancel} text='Cancel' style={{marginRight: '20px'}}/>
                        <Button onClick={this.errorCheck} text='Update' kind='bold'/>
                    </div>
                </TitleCard>
                {this.state.upload ?
                    <ProgressModal
                        title='Updating classifier' load={this.create}/>
                    : null
                }
            </div>
        )
    }
}
