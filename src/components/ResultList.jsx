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
                    self.props.results.map(function(face, index) {
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
                        if (index == 1) {
                            faceBox.border = '2px solid #F012BE';
                        } else if (index == 2) {
                            faceBox.border = '2px solid #85144b';
                        } else if (index == 3) {
                            faceBox.border = '2px solid #FF4136';
                        } else if (index == 4) {
                            faceBox.border = '2px solid #FF851B';
                        } else if (index == 5) {
                            faceBox.border = '2px solid #FFDC00';
                        } else if (index == 6) {
                            faceBox.border = '2px solid #01FF70';
                        } else if (index == 7) {
                            faceBox.border = '2px solid #2ECC40';
                        } else if (index == 8) {
                            faceBox.border = '2px solid #3D9970';
                        } else if (index == 9) {
                            faceBox.border = '2px solid #39CCCC';
                        } else if (index == 10) {
                            faceBox.border = '2px solid #7FDBFF';
                        } else if (index == 11) {
                            faceBox.border = '2px solid #0074D9';
                        } else if (index == 12) {
                            faceBox.border = '2px solid #001f3f';
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

    drawText = () => {
        var self = this
        if (this.props.results[0].word != null) {
            var fr = new FileReader
            fr.onload = function() {
                var img = new Image
                img.onload = function() {
                    var facesBox = []
                    self.props.results.map(function(word) {
                        var faceBox = {
                            display: 'block',
                            position: 'absolute',
                            marginTop: '10px',
                            zIndex: '2',
                            left: (word.location.left/img.width)*100 + '%',
                            top: (word.location.top/img.height)*100 + '%',
                            width: (word.location.width/img.width)*100 + '%',
                            height: 'calc(' + (word.location.height/img.height)*100 + '% - 10px)',
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
        this.drawText()
    }

    componentWillReceiveProps(newProps) {
        this.drawFace()
        this.drawText()
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
            backgroundPosition: '0 0',
            backgroundSize: '75px 25px',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            ':hover': {
                backgroundPosition: '-25px 0',
            },
            ':active': {
                backgroundPosition: '-50px 0',
            }
        }

        var resultList
        var self = this
        if (this.props.results[0].age != null) {
            resultList = this.props.results.map(function(result, index){
                var bodercolor = {
                }
                if (index == 0) {
                    bodercolor.border = '2px solid ' + Styles.colorPrimary;
                } else if (index == 1) {
                    bodercolor.border = '2px solid #F012BE';
                } else if (index == 2) {
                    bodercolor.border = '2px solid #85144b';
                } else if (index == 3) {
                    bodercolor.border = '2px solid #FF4136';
                } else if (index == 4) {
                    bodercolor.border = '2px solid #FF851B';
                } else if (index == 5) {
                    bodercolor.border = '2px solid #FFDC00';
                } else if (index == 6) {
                    bodercolor.border = '2px solid #01FF70';
                } else if (index == 7) {
                    bodercolor.border = '2px solid #2ECC40';
                } else if (index == 8) {
                    bodercolor.border = '2px solid #3D9970';
                } else if (index == 9) {
                    bodercolor.border = '2px solid #39CCCC';
                } else if (index == 10) {
                    bodercolor.border = '2px solid #7FDBFF';
                } else if (index == 11) {
                    bodercolor.border = '2px solid #0074D9';
                } else if (index == 12) {
                    bodercolor.border = '2px solid #001f3f';
                }
                return (
                    <li key={result.class}>
                        <div style={[imgStyle, topResult, bodercolor]}>
                            <div style={[textStyles.topClass, {display: 'inline-block'}]}>{capitalizeFirstLetter(self.props.results[index].gender.gender)}</div>

                            {self.props.results[index].age.min == null || self.props.results[index].age.max == null ?
                                <div style={[textStyles.topScore, {float: 'right', display: 'inline-block'}]}>{self.props.results[index].age.min || self.props.results[index].age.max}</div> :
                                <div style={[textStyles.topScore, {float: 'right', display: 'inline-block'}]}>age {self.props.results[index].age.min} - {self.props.results[index].age.max}</div>
                            }
                        </div>
                    </li>
                )
            })
        } else if (this.props.results[0].word != null) {
            var text = ''
            for (var i in this.props.results) {
                text += ' ' + this.props.results[i].word
            }
            resultList = <div>
                <div style={[imgStyle, topResult]}>
                    <div style={[textStyles.topClass, {display: 'inline-block'}]}>{text}</div>
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
                        <button id='button--results--clear' style={deleteStyle}
                            onClick={this.props.clearClassifier}>
                        </button>
                </div>
                <ul style={list} id={'results_' + this.props.id}> {resultList} </ul>

                {this.state.faces == null ?
                    <Tooltip placement='top' isOpen={self.state.tooltipOpen} delay={{show: 200, hide: 100}} autohide={false} target={'results_' + this.props.id} toggle={self.toggle}>
                        <div style={{textAlign: 'left'}}>
                            This number does not represent a percentage of accuracy, but instead indicates Watson’s confidence.
                        </div>
                        <a style={{color: 'white'}} href='https://www.ibm.com/watson/developercloud/doc/visual-recognition/customizing.html#guidelines-for-good-training' target='_blank'>
                            <u>Improve this score</u>
                        </a>
                    </Tooltip>:
                    null
                }
            </div>
        )
    }
}
