import React from 'react'
import Styles from './Styles'
import Radium from 'radium'
import { Tooltip } from 'reactstrap'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

@Radium
export default class ResultList extends React.Component {
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

    drawFace = () => {
        var self = this
        if (this.props.results[0].age != null) {
            var fr = new FileReader
            fr.onload = function() {
                var img = new Image
                img.onload = function() {
                    var facesBox = []
                    self.props.results.map(function(face) {
                        var faceBox = {
                            display: 'block',
                            position: 'absolute',
                            marginTop: '10px',
                            zIndex: '2',
                            left: (face.face_location.left/img.width)*100 + '%',
                            top: (face.face_location.top/img.height)*100 + '%',
                            width: (face.face_location.width/img.width)*100 + '%',
                            height: 'calc(' + (face.face_location.height/img.height)*100 + '% - 10px)',
                            border: '2px solid ' + Styles.colorPrimary,
                            boxShadow: '0px 0px 1px 1px rgba(255,255,255,.6)',
                            marginRight: '10px',
                        }
                        facesBox.push(faceBox)
                    })
                    self.setState({
                        faces: facesBox
                    })
                }
                img.src = fr.result
            }
            fr.readAsDataURL(this.props.file)
        }
    }

    componentDidMount() {
        this.drawFace()
    }

    componentWillReceiveProps(newProps) {
        this.drawFace()
    }

    render(){
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            dark: {
                color: Styles.colorTextDark,
            },
            topClass: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
            },
            topScore: {
                color: Styles.colorTextLight,
                font: Styles.fontHeader,
                fontWeight: '200',
            },
        }

        var imgStyle = {
            height: 'auto',
            width: '100%',
            border: '1px solid #dedede',
            marginTop: '10px',
            borderRadius: '5px',
            borderWidth: 'thin',
            borderStyle: 'solid',
        }

        var topResult = {
            padding: '10px',
        }

        var resultStyle = {
            paddingLeft: '15px',
            paddingRight: '15px',
            paddingTop: '10px',
        }

        var list = {
            padding: '0',
            margin: '0',
            listStyle: 'none',
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
                position: 'absolute',
                width: '100px',
                height: '100px',
                border: '1px solid #dedede',
                marginRight: '10px',
            }
        }

        var facesThing = {
            display: 'none'
        }

        var deleteStyle = {
            position: 'absolute',
            top: '15px',
            right: '5px',
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

        var resultList
        var self = this
        if (this.props.results[0].age != null) {
            resultList = <div>
                <div style={[imgStyle, topResult]}>
                    <div style={[textStyles.topClass, {display: 'inline-block'}]}>Gender</div>
                    <div style={[textStyles.topScore, {float: 'right', display: 'inline-block'}]}>{capitalizeFirstLetter(this.props.results[0].gender.gender)}</div>
                </div>
                <div style={[imgStyle, topResult]}>
                    <div style={[textStyles.topClass, {display: 'inline-block'}]}>Age</div>
                    {this.props.results[0].age.min == null || this.props.results[0].age.max == null ?
                        <div style={[textStyles.topScore, {float: 'right', display: 'inline-block'}]}>{this.props.results[0].age.min || this.props.results[0].age.max}</div> :
                        <div style={[textStyles.topScore, {float: 'right', display: 'inline-block'}]}>{this.props.results[0].age.min} - {this.props.results[0].age.max}</div>
                    }
                </div>
            </div>
        } else {
            resultList = this.props.results.map(function(result, index){
                return (
                    <li key={result.class}>
                        {index == 0 ?
                            <div style={[imgStyle, topResult]}>
                                <div style={[textStyles.topClass, {display: 'inline-block'}]}>{result.class}</div>
                                <div style={[textStyles.topScore, {float: 'right', display: 'inline-block'}]}>{~~(result.score * 100)}%</div>
                            </div>
                            :
                            <div style={resultStyle}>
                                <div style={[textStyles.base, textStyles.dark, {display: 'inline-block'}]}><b>{result.class}</b></div>
                                <div style={[textStyles.base, {float: 'right', display: 'inline-block'}]}>{~~(result.score * 100)}%</div>
                            </div>
                        }
                    </li>
                )
            })
        }
        if (this.state.faces != null) {
            var faces = this.state.faces.map(function(faceStyle) {
                console.log(faceStyle)
                return (
                    <div style={faceStyle} />
                )
            })
        }
        return (

            <div>
                <div style={{position: 'relative'}}>
                    {faces}
                    <img style={imgStyle} src={this.props.file.preview}/>
                        <button style={deleteStyle}
                            onClick={this.props.clearClassifier}>
                        </button>
                </div>
                <ul style={list} id='tooltipid'> {resultList} </ul>
                <Tooltip placement="right" isOpen={self.state.tooltipOpen} delay={{show: 200, hide: 100}} autohide={false} target='tooltipid' toggle={self.toggle}>
                    <a style={{color: 'white'}} href='https://www.ibm.com/blogs/bluemix/2016/10/watson-visual-recognition-training-best-practices/' target='_blank'>
                        What does this score mean?
                    </a>
                </Tooltip>
            </div>
        )
    }
}
