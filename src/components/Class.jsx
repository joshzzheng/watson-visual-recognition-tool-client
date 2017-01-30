import React from 'react'
import Radium from 'radium'
import Styles from './Styles'
import DropButton from './DropButton'

@Radium
export default class Class extends React.Component {
    onDrop = (file) => {
        this.props.setClassFile(file, this.props.id)
    }

    render() {
        return (
            <div className="col-sm-4">
                <div style={this.props.style}>
                    <input type="text" style={{marginTop: '12px', marginBottom: '5px'}}
                        placeholder='Class name' />
                    <DropButton text='Drag .zip here to train class' subtext='choose your file' onDrop={this.onDrop}/>
                </div>
            </div>
        )
    }
}
