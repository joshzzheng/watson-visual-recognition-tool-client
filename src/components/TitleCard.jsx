import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

@Radium
export default class TitleCard extends React.Component {
    render() {
        var cardStyle = {
            width: '100%',
            marginBottom:'4rem',
            borderRadius: '5px',
            borderColor: '#dedede',
            borderWidth: 'thin',
            borderStyle: 'solid',
            background: 'white',
        }

        var container = {
            padding: '12px',
        }

        var text = {
            background: 'none',
            border: 'none',
            borderBottom: '1px solid #dedede',
            outline: 'none',
            width: '100%',
            padding: '10px',
            ':focus': {
                borderBottom: `1px solid ${Styles.colorPrimary}`,
            }
        }

        var optional = {
            font: Styles.fontDefault,
            color: '#9e9e9e',
        }

        return (
            <div style={[cardStyle, this.props.style]}>
                {this.props.negative ?
                    <div style={[text, this.props.inputStyle]}>Negative <div style={[optional, {display: 'inline-block'}]}>(Optional)</div></div> :
                    <input type="text" style={[text, this.props.inputStyle]}
                        placeholder={this.props.placeholder}
                        onChange={this.props.onChange} />
                }
                <div style={container}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
