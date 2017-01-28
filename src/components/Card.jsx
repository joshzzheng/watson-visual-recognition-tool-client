import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

@Radium
export default class Card extends React.Component {
    render() {
        var cardStyle = {
            width: '100%',
            marginBottom:'4rem',
            borderRadius: '5px',
            borderColor: '#dedede',
            borderWidth: 'thin',
            borderStyle: 'solid',
            background: 'white',
            padding: '12px',
        }

        return (
            <div style={[cardStyle, this.props.style]}>
                {this.props.children}
            </div>
        )
    }
}
