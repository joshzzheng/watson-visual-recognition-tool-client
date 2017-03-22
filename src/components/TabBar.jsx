import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

var Link = require('react-router').Link
Link = Radium(Link)

@Radium
export default class TabBar extends React.Component {
    render() {
        var divider = {
            borderTop: '1px solid #f3f3f3',
        }

        var topBar = {
            margin: '0',
            padding: '0',
            listStyle: 'none',
        }

        var item = {
            margin: '0',
            padding: '0',
            float: 'left',
        }

        var link = {
            margin: '0',
            padding: '0',
            display: 'block',
            textDecoration: 'none',
            textAlign: 'center',
            paddingRight: '21px',
            lineHeight: '49px',
            color: Styles.colorTextLight,
            ':hover': {
                textDecoration: 'none',
                color: Styles.colorPrimary,
            }
        }

        var disabled = {
            margin: '0',
            padding: '0',
            display: 'block',
            textDecoration: 'none',
            textAlign: 'center',
            paddingRight: '21px',
            lineHeight: '49px',
            color: Styles.colorTextLight,
            opacity: '0.4',
        }

        var active = {
            textDecoration: 'none',
            color: Styles.colorPrimary,
        }

        var unordered = {
            margin: '0',
            padding: '0',
            overflow: 'hidden',
        }

        var shadowWrapper = {
            zIndex: '1000',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: '65px',
            left: '0px',
            right: '0px',
            background: '#fff',
            height: '49px',
        }

        var contentWrapper = {
            borderTop: '1px solid #f3f3f3',
            maxWidth: '1000px',
            width: '100%',
            height: '100%',
            margin: 'auto',
        }

        return (
            <div style={shadowWrapper}>
                <div style={contentWrapper}>
                    <ul style={[topBar, unordered]}>
                        <li style={item}><Link style={link} to="/" activeStyle={active} onlyActiveOnIndex={true}>Classifiers</Link></li>
                        <li style={item}><div style={disabled}>Collections (Coming soon)</div></li>
                    </ul>
                </div>
            </div>
        )
    }
}
