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

        return (
            <div className="col-sm-4">
                <div style={this.props.style}>
                    <TitleCard
                        negative={this.props.negative}
                        inputStyle={textStyles.header}
                        placeholder='Class name'
                        onChange={this.onTextChange}>
                        <DropButton style={extraPadding} text='Drag .zip here to train class' subtext='choose your file' onDrop={this.onDrop}/>
                    </TitleCard>
                </div>
            </div>
        )
    }
}
