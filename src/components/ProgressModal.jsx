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
        var self = this
        this.props.load(function(p) {
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
            borderColor: '#dedede',
            borderWidth: 'thin',
            borderStyle: 'solid',
            background:  '#fcfcfc',
            padding: '25px 0px',
        }

        var cover = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: this.state.progress + '%',
            height: '100%',
            backgroundColor: Styles.colorPrimary,
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            borderRadius: '2px'
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

        var moveKeyframes = Radium.keyframes({
            '0%': {backgroundPosition: '0 0'},
            '100%': {backgroundPosition: '50px 50px'},
        }, 'move');

        var processing = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
        	backgroundColor: Styles.colorPrimary,
        	borderRadius:'3px',
        	boxSizing:'border-box',
        	backgroundImage:`linear-gradient(-45deg, ${Styles.colorDarkPrimary} 25%, transparent 25%, transparent 50%, ${Styles.colorDarkPrimary} 50%, ${Styles.colorDarkPrimary} 75%, transparent 75%, transparent)`,
        	backgroundSize: '100px 100px',
            animationName: moveKeyframes,
            animationDuration: '1.5s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
        	overflow: 'hidden',
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
                            <div style={dropzoneStyle}>
                                {this.state.progress >= 100 ?
                                    <StyleRoot>
                                        <div style={processing}></div>
                                    </StyleRoot> :
                                    <div style={cover}></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
