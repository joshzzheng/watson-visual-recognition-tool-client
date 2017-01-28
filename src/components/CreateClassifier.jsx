import React from 'react'
import Radium from 'radium'
import {browserHistory} from 'react-router'
import Styles from './Styles'
import Card from './Card'
import Button from './Button'
import Class from './Class'

@Radium
export default class CreateClassifier extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            classifierName: "",
            classes: [
              {name: "Negative", file: null},
              {name: "", file: null}
            ]
        }
    }

    cancel = () => {
        browserHistory.push('/')
    }

    create = () => {
        browserHistory.push('/')
    }

    render() {
        var textStyles = {
            base: {
                color: Styles.colorTextLight,
                font: Styles.fontDefault,
            },
            header: {
                color: Styles.colorTextDark,
                font: Styles.fontHeader,
            }
        }

        var margin = {
            marginTop: '5px',
        }

        return (
            <div>
                <div style={textStyles.header}>
                    Create a new classifier
                </div>
                <div style={[textStyles.base, margin]}>
                    A classifier is a group of classes that are trained against each other. This allows you identify highly specialized subjects.
                </div>
                <input type="text"
                    style={textStyles.header}
                    placeholder='Classifier name' />
                <Card>
                    <div style={textStyles.header}>
                        Classes
                    </div>
                    <div style={[textStyles.base, {maxWidth: '800px'}, margin]}>
                        A classifier named "fruit" may have a “pear”, “apple”, and “banana” class or just a “banana” class and a collection of negative examples. Negative examples are not used to create a class, but does define what the classifier is not.
                    </div>
                    <Class/>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={this.cancel} text='Cancel' style={{marginRight: '20px'}}/>
                        <Button onClick={this.create} text='Create' kind='bold'/>
                    </div>
                </Card>
            </div>
        )
    }
}
