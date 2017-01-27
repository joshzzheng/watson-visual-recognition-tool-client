import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

@Radium
class ResultList extends React.Component {
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
                width: '100px',
                height: '100px',
                border: '1px solid #dedede',
                marginRight: '10px',
            }
        }

      var resultList = this.props.results.map(function(result, index){
        return (
          <li key={result.class}>
            {index == 0 ?
                <div style={[imgStyle, topResult]}>
                    <div style={[textStyles.topClass, {display: 'inline-block'}]}>{result.class}</div>
                    <div style={[textStyles.topScore, {float: 'right', display: 'inline-block'}]}>{~~(result.score * 100)}%</div>
                </div> :
                <div style={resultStyle}>
                    <div style={[textStyles.base, textStyles.dark, {display: 'inline-block'}]}><b>{result.class}</b></div>
                    <div style={[textStyles.base, {float: 'right', display: 'inline-block'}]}>{~~(result.score * 100)}%</div>
                </div>
            }
          </li>
        )
      })

      return (
        <div>
            {/*<div style={containerStyles.base}>
                <div style={[containerStyles.base, containerStyles.image]}><img style={imgStyle} src={this.props.file.preview}/></div>
                <div style={[textStyles.base, textStyles.uploading]}><ul> {resultList} </ul></div>
            </div>*/}
            <img style={imgStyle} src={this.props.file.preview}/>
            <ul style={list}> {resultList} </ul>
        </div>
      );
    }
}

module.exports = ResultList
