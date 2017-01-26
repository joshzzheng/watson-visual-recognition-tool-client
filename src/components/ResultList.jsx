import React from 'react'
import Styles from './Styles'
import Radium from 'radium'

@Radium
class ResultList extends React.Component {
    render(){
      var resultList = this.props.results.map(function(result){
        return (
          <li key={result.class}>
            <b>{result.class} : {result.score} </b>
          </li>
        );
      })

      var textStyles = {
          base: {
              color: Styles.colorTextLight,
              font: Styles.fontDefault,
          },
          uploading: {
              font: Styles.fontBold,
              display: 'inline-flex',
              verticalAlign: 'middle',
          }
      }

      var imgStyle = {
          height: 'auto',
          width: '100%',
          border: '1px solid #dedede',
          marginTop: '10px',
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

      return (
        <div>
            {/*<div style={containerStyles.base}>
                <div style={[containerStyles.base, containerStyles.image]}><img style={imgStyle} src={this.props.file.preview}/></div>
                <div style={[textStyles.base, textStyles.uploading]}><ul> {resultList} </ul></div>
            </div>*/}
            <img style={imgStyle} src={this.props.file.preview}/>
            <ul> {resultList} </ul>
        </div>
      );
    }
}

module.exports = ResultList
