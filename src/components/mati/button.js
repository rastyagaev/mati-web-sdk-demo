import React from 'react'
import { connect } from 'react-redux'
import MatiSDK from 'mati-web-sdk'
import { Portal } from 'react-portal'
import { withMatiSettings } from './context'
import {
  createIdentity,
  uploadDocumentFrontSide,
  uploadDocumentBackSide
} from './state'

import ImageBox from './image-box'
import './mati.css'

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.client = new MatiSDK(props.matiSettings)
  }

  openFileDialog = () => this.input.click()

  createIdentity = () => {
    const { dispatch } = this.props
    const { client } = this
    if (this.input.files.length) {
      dispatch(createIdentity(client, this.input.files[0]))
    }
  }

  setStep = step => this.setState({ step })

  createIdentityStep = imageDataUri => {
    this.props
      .dispatch(createIdentity(this.client, dataURLtoBlob(imageDataUri)))
      .then(() => this.setState({ step: 2 }))
  }

  uploadDocumentFrontStep = imageDataUri => {
    this.props
      .dispatch(
        uploadDocumentFrontSide(
          this.client,
          this.props.identity.id,
          this.props.documentType,
          dataURLtoBlob(imageDataUri)
        )
      )
      .then(() => this.setState({ step: 3 }))
  }

  uploadDocumentBackStep = imageDataUri => {
    this.props
      .dispatch(
        uploadDocumentBackSide(
          this.client,
          this.props.document.id,
          dataURLtoBlob(imageDataUri)
        )
      )
      .then(() => {
        this.props.onFinish()
        this.setState({ step: 0 })
      })
  }

  renderCurrentStep() {
    const contents = [
      'Upload your photo',
      'Upload the front side of your document',
      'Upload the back side of your document'
    ]

    const handlers = [
      this.createIdentityStep,
      this.uploadDocumentFrontStep,
      this.uploadDocumentBackStep
    ]

    const { step } = this.state

    return (
      <ImageBox key={`step-${step}`} onClose={handlers[step - 1]}>
        {contents[step - 1]}
      </ImageBox>
    )
  }

  render() {
    return (
      <div className="mati-button">
        <button onClick={() => this.setStep(1)}>{this.props.children}</button>
        {this.state.step ? (
          <Portal>
            <div className="mati-modal">{this.renderCurrentStep()}</div>
          </Portal>
        ) : null}
      </div>
    )
  }
}

export const MatiButton = connect(({ mati }) => ({ ...mati }))(
  withMatiSettings(Button)
)
