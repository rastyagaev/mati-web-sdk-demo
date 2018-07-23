import React from 'react'
import Webcam from 'react-webcam'

export default class ImageBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  showCamera = () => this.setState({ showCamera: true })

  hideCamera = () => this.setState({ showCamera: false })

  openFileDialog = () => this.input.click()

  capture = () => this.setState({ image: this.webcam.getScreenshot() })

  choseFile = () => {
    if (this.input.files.length === 0) return
    const reader = new FileReader()
    reader.onloadend = () => this.setState({ image: reader.result })
    reader.readAsDataURL(this.input.files[0])
  }

  close = () => {
    this.props.onClose(this.state.image)
  }

  reTake = () => this.setState({ image: null })

  renderCamera() {
    return (
      <React.Fragment>
        <Webcam
          audio={false}
          height={400}
          ref={webcam => (this.webcam = webcam)}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: 'user'
          }}
        />
        <div>
          <button onClick={this.capture}>capture</button> or{' '}
          <button onClick={this.hideCamera}>back to options.</button>
        </div>
      </React.Fragment>
    )
  }

  renderOptionsScreen() {
    return (
      <div>
        <button onClick={this.showCamera}>Use your camera</button> to take a
        photo or <button onClick={this.openFileDialog}>upload one</button>.
      </div>
    )
  }

  render() {
    if (this.state.image) {
      return (
        <React.Fragment>
          <header>{this.props.children}</header>
          <img src={this.state.image} />
          <button onClick={this.close}>Done</button>{' '}
          <button onClick={this.reTake}>Re-take</button>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <header>{this.props.children}</header>

        {this.state.showCamera
          ? this.renderCamera()
          : this.renderOptionsScreen()}

        <input
          type="file"
          style={{ display: 'none' }}
          accept="image/x-png,image/jpeg"
          ref={input => (this.input = input)}
          onChange={this.choseFile}
        />
      </React.Fragment>
    )
  }
}
