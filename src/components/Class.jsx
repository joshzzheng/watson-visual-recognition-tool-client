import React from 'react'
import Radium from 'radium'
import Styles from './Styles'
import DropButton from './DropButton'
import TitleCard from './TitleCard'

@Radium
export default class Class extends React.Component {
    onDrop = (file) => {
        this.props.setClassFile(file, this.props.id)
    }

    onTextChange = (text) => {
        this.props.setClassName(text, this.props.id)
    }

    delete = () => {
        this.props.delete(this.props.id)
    }

    render() {
        var textStyles = {
            header: {
                color: Styles.colorTextDark,
                font: Styles.fontDefault,
                fontWeight: 'bold',
            }
        }

        var extraPadding = {
            padding: '44px 0px'
        }

        var deleteStyle = {
            backgroundColor: 'transparent',
            backgroundImage: `url(${'btn_delete.png'})`,
            height: '25px',
            width: '25px',
            backgroundSize: 'contain',
            border: 'none',
            ':hover': {
                backgroundImage: `url(${'btn_delete_hover.png'})`,
            },
            ':active': {
                backgroundImage: `url(${'btn_delete_pressed.png'})`,
            }
        }

        return (
            <div className="grid-item">
                <div style={this.props.style}>
                    <TitleCard
                        errors={this.props.errors}
                        title={this.props.title}
                        negative={this.props.negative}
                        inputStyle={textStyles.header}
                        placeholder='Class name'
                        onChange={this.onTextChange}>
                        {this.props.negative ? null :
                            <div style={{position: 'relative', width: '100%', minWidth: '100%'}}>
                                <div style={{position: 'absolute', top: '-43px', right: '0'}}>
                                    <button key={this.props.id} style={deleteStyle}
                                        onClick={this.delete}>
                                    </button>
                                </div>
                            </div>
                        }
                        <DropButton style={extraPadding} errors={this.props.errors} text='Drag .zip here to train class' subtext='choose your file' onDrop={this.onDrop}/>
                    </TitleCard>
                </div>
            </div>
        )
    }
}
