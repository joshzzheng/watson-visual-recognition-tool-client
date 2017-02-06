import React from 'react'
import ReactDOM from 'react-dom'
import Styles from './Styles'
import Radium, { StyleRoot } from 'radium'

@Radium
export default class ProgressModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0
         }
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).modal({
            backdrop: 'static',
            keyboard: false
        })
        $(ReactDOM.findDOMNode(this)).modal('show')
        var self = this
        this.props.load(function(p) {
            console.log(p)
            self.setState({ progress: p })
        },
        function() {
            $(ReactDOM.findDOMNode(self)).modal('hide')
        })
    }

    render() {
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            title: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
            },
            ellipsis: {
                /* Required for text-overflow to do anything */
                maxWidth: '200px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            },
            uploading: {
                display: 'inline-flex',
            },
            clip: {
                /* Required for text-overflow to do anything */
                maxWidth: '200px',
                textOverflow: 'clip',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }
        }

        var dropzoneStyle = {
            position: 'relative',
            width: '100%',
            alignSelf: 'center',
            borderRadius: '5px',
            borderColor: '#959595',
            borderWidth: 'thin',
            borderStyle: 'dashed',
            background:  '#fcfcfc',
            padding: '25px 0px',
        }

        const RGB=Styles.colorPrimary;
        const A='0.2';
        const RGBA='rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')';

        var cover = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: `${this.state.progress}%`,
            height: '100%',
            backgroundColor: RGBA,
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            borderRadius: '5px'
        }

        var opacityKeyframes = Radium.keyframes({
            '0%': {opacity: '.2'},
            '20%': {opacity: '1'},
            '80%': {opacity: '1'},
            '100%': {opacity: '.2'},
        }, 'opacity');

        var dot = {
            animationName: opacityKeyframes,
            animationDuration: '1.4s',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
        }

        var two = {
            animationDelay: '.2s',
        }

        var three = {
            animationDelay: '.4s',
        }

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div style={textStyles.title}>Creating classifier</div>
                            <div style={textStyles.base}>This may take several minutes to complete.</div>
                        </div>
                        <div className="modal-body">
                            <div id="loading-ellipsis" style={[textStyles.base, textStyles.uploading]}>
                                <div style={textStyles.clip}>{this.state.progress >= 100 ? 'Processing' : 'Uploading'}{this.state.progress}</div>
                                <StyleRoot>
                                    <span style={dot}>.</span>
                                    <span style={[dot, two]}>.</span>
                                    <span style={[dot, three]}>.</span>
                                </StyleRoot>
                            </div>
                            <div style={dropzoneStyle}>
                                <div style={cover}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
