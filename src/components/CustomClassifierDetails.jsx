import React from 'react'
import request from 'superagent'
import ResultList from './ResultList'
import DropButton from './DropButton'
import Styles from './Styles'
import Radium from 'radium'

@Radium
class ClassifierDetail extends React.Component {
    loadClassifierDetailsFromServer = () => {
        var self = this
        var req = request.get(this.props.host + "api/classifier" + this.props.classiferID)

        req.type('json')
        req.set('api_key', this.props.apiKey)
        req.set('Expires', '-1')
        req.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1,private')

        req.end(function(err, res) {
            self.setState({classifier: data})
        })
    }

    onDrop = (files, onFinished) => {
        var self = this
        var req = request.post(this.props.host + "api/classify")

        if (files[0]) {
            req.attach('file', files[0])
        }

        req.field('classifier_id', this.props.classifierID)
        req.field('api_key', this.props.apiKey)

        req.on('progress', function(e) {
            console.log(e.direction + ' Percentage done: ' + e.percent)
        })

        req.end(function(err, res) {
            var results = res.body.images[0].classifiers[0].classes
            results.sort(function(a, b) {
                return b.score - a.score;
            })
            console.log(results)
            self.setState({ file: files[0], results: results })
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

        var cardStyle = {
            maxWidth:'30rem',
            marginBottom:'4rem',
            borderRadius: '5px',
            borderColor: '#dedede',
            borderWidth: 'thin',
            borderStyle: 'solid',
            background: 'white',
            padding: '12px',
        }

        var status = {
            marginBottom: '-1px',
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '5px',
            background: '#64dd17',
        }

        return(
            <div className="col-sm-4">
                <div style={cardStyle}>
                    <div style={titleStyle}>{this.props.name}</div>
                    <div style={textStyle}>{this.props.classifierID}</div>
                    <div style={textStyle}>{this.props.status} <div style={status}/></div>

                    <div style={{width: '100%', height:'20px'}}></div>

                    <DropButton
                        onDrop={this.onDrop}
                        text={"Drag images here to classify them"}
                        subtext={"choose your files"} />
                    {this.state.results ? <ResultList file={this.state.file} results={this.state.results}/> : null}
                </div>
            </div>
        )
    }
}

module.exports = ClassifierDetail
