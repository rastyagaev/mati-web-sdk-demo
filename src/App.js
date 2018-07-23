import React, { Component } from 'react'
import firebase from 'firebase'
import MatiSDK from 'mati-web-sdk'
import {
  MatiButton,
  getDocument,
  getIdentity,
  withMatiSettings
} from './components/mati'
import { last } from 'lodash'
import { connect } from 'react-redux'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      identityId: null,
      documentID: null
    }

    firebase.initializeApp({
      databaseURL: 'https://mati-callbacks-demo.firebaseio.com'
    })

    this.client = new MatiSDK(this.props.matiSettings)
  }

  observeEvents = data => {
    switch (data.val().eventName) {
      case 'document_parsed': {
        const documentId = last(data.val()._links.resource.href.split('/'))
        if (this.props.document && documentId == this.props.document.id) {
          this.props.dispatch(getDocument(this.client, documentId))
        }
        break
      }
      case 'face_verification_completed': {
        const identityId = last(data.val()._links.resource.href.split('/'))
        if (this.props.identity && identityId == this.props.identity.id) {
          this.props.dispatch(getIdentity(this.client, identityId))
        }
        break
      }
      default:
    }
  }

  componentDidMount() {
    const ref = firebase.database().ref('events')
    ref.on('child_added', this.observeEvents)
  }

  showUserData = () => {}

  renderDocumentData = () => {
    return (
      <dl>
        <h2>Document data</h2>
        {this.props.document.fields.map(field => (
          <React.Fragment>
            <dt key={`term-${field.id}`}>{field.label}</dt>
            <dd key={`def-${field.id}`}>{field.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    )
  }

  renderIdentityData = () => {
    return (
      <dl>
        <h2>Identity data</h2>
        <dl>
          <dt>Face match score</dt>
          <dd>{this.props.identity.facematchScore}%</dd>
        </dl>
      </dl>
    )
  }

  render() {
    return (
      <div className="App">
        <MatiButton
          onRegistrationComplete={this.showUserData}
          documentType="national-id"
          onFinish={this.showUserData}
        >
          🙋 Register new user
        </MatiButton>

        {this.props.identity ? this.renderIdentityData() : null}
        {this.props.document ? this.renderDocumentData() : null}
      </div>
    )
  }
}

export default connect(({ mati }) => ({ ...mati }))(withMatiSettings(App))
