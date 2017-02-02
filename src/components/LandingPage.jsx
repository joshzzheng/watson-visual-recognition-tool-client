import React from 'react'
import Styles from './Styles'
import Radium, { Style } from 'radium'

@Radium
export default class LandingPage extends React.Component {
    onBlur = () => {
        this.setState({focus: false})
    }
    onFocus = () => {
        this.setState({focus: true})
    }

    render() {
        var buttonStyle = {
            base: {
                position: 'fixed',
                lineHeight: '0px',
                alignSelf: 'center',
                borderRadius: '30px',
                border: 'none',
                height: '60px',
                width: '600px',
                font: Styles.fontTitle,
                padding: '0px 44px 0px 44px',
                color: Styles.colorTextLight,
                background: 'white',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 2px 2px 0px rgba(0,0,0,.15), 0 0 0 1px rgba(0,0,0,.08)',
                transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                zIndex: '10',

                ':hover': {
                    boxShadow: '0 3px 9px 0px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.08)',
                    transition: 'box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                },
                ':focus': {
                    outline: 'none',
                }
            }
        }

        var keyNone = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            font: Styles.fontTitle,
            fontWeight: 'normal',
            color: 'white',
            transform: 'translate(-245px, -20px)',
            opacity: '0',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var key = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            font: Styles.fontTitle,
            fontWeight: 'normal',
            color: 'white',
            transform: 'translate(-245px, -70px)',
            opacity: '1',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var getKey = {
            position: 'fixed',
            left: '50%',
            top: '50%',
            font: Styles.fontHeader,
            fontWeight: 'normal',
            color: 'white',
            transform: 'translate(-50%, 55px)',
            opacity: '1',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var link = {
            color: 'white'
        }

        var picsNone = {
            position: 'fixed',
            height: '45px',
            width: '45px',
            left: '50%',
            top: '50%',
            transform: 'translate(220px, -50%)',
            opacity: '0',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var pics = {
            position: 'fixed',
            height: '45px',
            width: '45px',
            left: '50%',
            top: '50%',
            transform: 'translate(247.5px, -50%)',
            opacity: '1',
            zIndex: '11',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var background = {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: `url(${'splashscreen.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
        }

        var skrim = {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'rgba(151,83,225,.8)',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        var skrimNone = {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'rgba(151,83,225,0)',
            transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        }

        return(
            <div style={background}>
                {this.state.focus ? <div style={skrim}/> : <div style={skrimNone}/>}
                <Style scopeSelector='.myInputs:focus::-webkit-input-placeholder' rules={{
                    transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                    opacity: '0',
                }} />
                <Style scopeSelector='.myInputs:-moz-placeholder' rules={{
                    opacity: '1',
                }} />
                <Style scopeSelector='.myInputs::-moz-placeholder' rules={{
                    opacity: '1',
                }} />
                <Style scopeSelector='.myInputs:-ms-input-placeholder' rules={{
                    opacity: '1',
                }} />
                <input type='text'
                    className='myInputs'
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    style={buttonStyle.base}
                    placeholder='API Key'
                    onChange={this.onTextChange}/>
                {this.state.focus ? <div style={key}>API Key</div> : <div style={keyNone}>API Key</div>}
                {this.state.focus ? <img src='btn_submit.png' style={pics}></img> : <img src='btn_submit.png' style={picsNone}></img>}
                <div style={getKey}>Don’t have a key? Get one for free <a href='https://console.ng.bluemix.net/registration/?target=/catalog/services/visual-recognition/' target='_blank' style={link}><u>here</u></a></div>
            </div>
        )
    }
}
