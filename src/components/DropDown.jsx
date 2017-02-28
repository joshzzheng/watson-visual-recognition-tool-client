import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

@Radium
export default class DropDown extends React.Component {
    toggleHover = () => {
        this.setState({hover: !this.state.hover})
    }

    render() {

        var dropbtn = {
            background: `url(${'/btn_dropdown.png'})`,
            backgroundSize: 'contain',
            width: '15px',
            height: '15px',
            padding: '0px',
            border: 'none',
            cursor: 'pointer',
        }

        var dropdown = {
            position: 'relative',
            display: 'inline-block',
        }

        var dropdownContent = {
            borderRadius: '5px',
            display: 'none',
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'white',
            minWidth: '160px',
            boxShadow: '0 0 0 1pt rgba(0,0,0,0.08), 0px 8px 16px 0px rgba(0,0,0,0.2)',
            zIndex: '1',
        }

        var aStyle = {
            font: Styles.fontDefault,
            color: Styles.colorTextDark,
            padding: '12px 16px',
            textDecoration: 'none',
            display: 'block',
            ':hover': {
                backgroundColor: '#f9f9f9'
            }
        }

        // This is really dumb...
        var aa = {
            ':hover': {
                borderRadius: '5px 5px 0px 0px',
            }
        }

        var ab = {
            ':hover': {
                borderRadius: '0px',
            }
        }

        var ac = {
            ':hover': {
                borderRadius: '0px 0px 5px 5px',
            }
        }

        if (this.state.hover) {
            dropdownContent.display = 'block'
        }

        return (
            <div style={[dropdown, {float: 'right'}]}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}>
                <button style={dropbtn}></button>
                <div style={dropdownContent}>
                    <a style={[aStyle, aa]} key='0' href={this.props.link} target='_blank'>API reference</a>
                    <a style={[aStyle, ab]} key='1' href="#" onClick={this.props.update}>Update</a>
                    <a style={[aStyle, ac, {color: '#f44336'}]} key='2' href="#" onClick={this.props.delete}>Delete</a>
                </div>
            </div>
        )
    }
}
