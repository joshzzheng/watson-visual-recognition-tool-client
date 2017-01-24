import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

@Radium
class Button extends React.Component {
    static defaultProps = {
        kind: 'thin'
    };
    static propTypes = {
      kind: React.PropTypes.oneOf(['thin', 'bold'])
    };
    render() {
        var buttonStyle = {
            base: {
                cursor: 'pointer',
                lineHeight: '0px',
                alignSelf: 'center',
                borderRadius: '15px',
                borderColor: Styles.colorPrimary,
                borderWidth: 'thin',
                borderStyle: 'solid',
                height: '30px',
                fontSize: '14px',
                fontWeight: '200',
                fontFamily: 'Helvetica, sans-serif',
                padding: '0px 21px 0px 21px',

                ':hover': {
                    color: 'white',
                    background: Styles.colorPrimary,
                    borderColor: Styles.colorPrimary,
                }
            },
            thin: {
                color: Styles.colorPrimary,
                background: 'rgba(0,0,0,0)',
                borderColor: Styles.colorPrimary,

                ':hover': {
                    color: 'white',
                    background: Styles.colorPrimary,
                    borderColor: Styles.colorPrimary,
                }
            },
            bold: {
                color: 'white',
                background: Styles.colorPrimary,
                borderColor: Styles.colorPrimary,

                ':hover': {
                    color: 'white',
                    background: Styles.colorDarkPrimary,
                    borderColor: Styles.colorDarkPrimary,
                }
            },
            image: {
                padding: '0px 4px 0px 21px',
            }
        };

        var imgStyle = {
            width: '21px',
            height: '21px',
            marginLeft: '21px',
        };

        return (
            <button
              style = {
                this.props.icon ? [buttonStyle.base, buttonStyle[this.props.kind], buttonStyle.image] : [buttonStyle.base, buttonStyle[this.props.kind]]
              }
              onClick={this.props.onClick}>
    						{this.props.text}
                {this.props.icon ? <img src={this.props.icon} style={imgStyle}></img> : ''}
            </button>
        );
    }
}

module.exports = Button;
