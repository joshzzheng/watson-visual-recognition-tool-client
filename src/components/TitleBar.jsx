import React from 'react'
import Button from './Button'
import ApiKeyModal from './ApiKeyModal'
import Styles from './Styles'
import Radium from 'radium'

@Radium
class TitleBar extends React.Component {
    static defaultProps = {
        title: 'Title',
    }

    constructor(props) {
        super(props)
        this.state = {
            apiKey: props.apiKey
        }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.apiKey !== null) {
        this.setState({apiKey: nextProps.apiKey})
      }
    }

    render() {
        var filter = {
            position: 'absolute',
            background: Styles.colorPrimary,
            mixBlendMode: 'screen',
            width: '60px',
            height: '60px',
            float: 'left',
        }

        var logo = {
            height: '60px',
            float: 'left',
        };

        var lineHeight = {
            lineHeight: '65px',
        }

        var title = {
            display: 'inline-block',
            font: Styles.fontTitle,
            color: Styles.colorTextDark,
        }

        var right = {
            font: Styles.fontDefault,
            color: Styles.colorTextLight,
            display: 'flex',
            justifyContent: 'center',
            float: 'right',
        }

        var shadowWrapper = {
            zIndex: '1000',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: '0px',
            left: '0px',
            right: '0px',
            background: '#fff',
            height: '65px',
        }

        var contentWrapper = {
            maxWidth: '1000px',
            width: '100%',
            height: '100%',
            margin: 'auto',
        }

        return (
            <div style={shadowWrapper}>
                <div style={contentWrapper}>
                    <div style={filter}></div>
                    <img src="watson.png" style={logo}></img>
                    <div style={[title, lineHeight]}>Visual Recognition Tool</div>
                    <div style={[right, lineHeight]}>
                        API Key: {this.state.apiKey || "Unknown"} &nbsp;&nbsp;
                        <Button onClick={this.props.onClick} text={"Update key"}/>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = TitleBar
