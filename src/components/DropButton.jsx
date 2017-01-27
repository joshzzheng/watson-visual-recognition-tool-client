import React from 'react'
import Dropzone from 'react-dropzone'
import Styles from './Styles'
import Radium from 'radium'

@Radium
export default class DropButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = { files: [] }
    }

    onDrop = (files) => {
        var self = this
        this.setState({ files: files }, function() {
            this.props.onDrop(this.state.files, function() {
                self.setState({ files: [] })
            })
        })
    }

    onOpenClick = () => {
        this.refs.dropzone.open()
    }

    toggleHover = () => {
        this.setState({hover: !this.state.hover})
    }

    render() {
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            link: {
                color: Styles.colorPrimary,
            },
            header: {
                font: Styles.fontBold,
                marginTop: '3px',
                marginBottom: '7px',
                textAlign: 'center',
            },
            subheader: {
                textAlign: 'center',
                marginBottom: '3px',
            },
            uploading: {
                font: Styles.fontBold,
                display: 'inline-flex',
                verticalAlign: 'middle',
            },
            ellipsis: {
                /* Required for text-overflow to do anything */
                maxWidth: '200px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }
        }

        if (this.state.hover) {
            textStyles.link.textDecoration = 'underline'
        } else {
            textStyles.link.textDecoration = 'none'
        }

        var dropzoneStyle = {
            width: '100%',
            cursor: 'pointer',
            alignSelf: 'center',
            borderRadius: '5px',
            borderColor: '#959595',
            borderWidth: 'thin',
            borderStyle: 'dashed',
            background: '#fcfcfc',
            padding: '25px 0px',
        }

        var imgStyle = {
            display: 'inline-flex',
            margin: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
        }

        var containerStyles = {
            base: {
                width: '100%',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            },
            image: {
                width: '45px',
                height: '45px',
                border: '1px solid #dedede',
                marginRight: '10px',
            }
        }

        return (
            <Dropzone ref="dropzone"
                onDrop={this.onDrop}
                multiple={false}
                style={dropzoneStyle}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}>
                {this.state.files.length > 0 ?
                    <div style={containerStyles.base}>
                        {this.state.files.map((file) => <div key={file.name} style={[containerStyles.base, containerStyles.image]}><img style={imgStyle} src={file.preview}/></div> )}
                        <div style={[textStyles.base, textStyles.uploading]}><div style={textStyles.ellipsis}>Uploading {this.state.files[this.state.files.length - 1].name}...</div></div>
                    </div> :
                    <div>
                        <div style={[textStyles.base, textStyles.header]}>
                            {this.props.text}
                        </div>
                        <div style={[textStyles.base, textStyles.subheader]}>
                            Or <span style={[textStyles.base, textStyles.link]}>{this.props.subtext}</span>
                        </div>
                    </div>
                }
            </Dropzone>
        )
    }
}
