import React from 'react'
import Radium from 'radium'
import { Tooltip } from 'reactstrap'

import Styles from './Styles'
import DropButton from './DropButton'
import TitleCard from './TitleCard'

@Radium
export default class Class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tooltipOpen: false
        }
    }

    toggle = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

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
            backgroundImage: `url(${'/btn_delete.png'})`,
            height: '25px',
            width: '25px',
            backgroundSize: 'contain',
            border: 'none',
            ':hover': {
                backgroundImage: `url(${'/btn_delete_hover2.png'})`,
            },
            ':active': {
                backgroundImage: `url(${'/btn_delete_pressed2.png'})`,
            }
        }

        return (
            <div className="grid-item">
                <div style={this.props.style}>
                    <TitleCard
                        id={this.props.negative ? 'neg' : null}
                        errors={this.props.errors}
                        title={this.props.title}
                        negative={this.props.negative}
                        fixedTitle={this.props.fixedTitle}
                        inputStyle={textStyles.header}
                        placeholder='Class name'
                        onChange={this.onTextChange}>
                        {this.props.negative || this.props.fixedTitle ? null :
                            <div style={{position: 'relative', width: '100%', minWidth: '100%'}}>
                                <div style={{position: 'absolute', top: '-43px', right: '0'}}>
                                    <button key={this.props.id} style={deleteStyle}
                                        onClick={this.delete}>
                                    </button>
                                </div>
                            </div>
                        }
                        <DropButton
                            accept={'application/zip'}
                            maxSize={100 * 1024 * 1024}
                            style={extraPadding}
                            errors={this.props.negative ? false : this.props.errors}
                            text='Drag .zip here to train class'
                            subtext='choose your file'
                            onDrop={this.onDrop}
                            clear={true}/>
                        {this.props.negative ?
                            <Tooltip placement='left' isOpen={this.state.tooltipOpen} delay={{show: 200, hide: 100}} autohide={false} target='neg' toggle={this.toggle}>
                                <div style={{textAlign: 'left'}}>Negative examples define what the classifier is not. They should be images that are visually similar to the positive examples, but do not depict any class.</div>
                            </Tooltip> :
                        null}
                    </TitleCard>
                </div>
            </div>
        )
    }
}
