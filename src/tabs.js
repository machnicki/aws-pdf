import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import _get from 'lodash/get'
import base64 from 'base-64'
import Handlebars from 'handlebars'

import http from './http'
import mock from './apimock'
import './tabs.scss'

class CustomTabs extends Component {
  state = {
    isLoading: false,
    template: '',
    preview: '',
    documentPreview: '',
    activeTab: 'template',
  }

  componentWillMount() {
    this.templateRequest()
  }

  componentWillReceiveProps({ documentName }) {
    if (this.props.documentName !== documentName) this.handleSelectTabs(documentName)
  }

  handleSelectTabs = key => {
    this.setState({ activeTab: key })

    switch(key) {
      case 'preview':
        this.preparePreview()
        break
      case 'template':
        break
      default:
        this.documentPreview(key)
    }
  }

  preparePreview = () => {
    const { template } = this.state

    if (template && mock.articles) {
      const hTemplate = Handlebars.compile(template)
      const html = hTemplate({
        headline: 'NEWS country / category / date',
        articles: mock.articles,
      })
      this.setState({ preview: html })
    }
  }

  documentPreview = name => {
    this.setState({ documentPreview: 'loading...' })
    http.request({
      url: `?name=${name}`
    })
      .then((response) => {
        console.log('response.data', response.data)
        const documentPreview = base64.decode(response.data)
        this.setState({ documentPreview })
      })
      .catch((error) => {
        const message = _get(error, 'response.data.error') || error
        console.error('error', message)
        this.setState({ documentPreview: message })
      })
  }

  templateRequest = (template) => {
    this.setState({ isLoading: true })
    return http.request({
      url: 'template',
      method: template ? 'post' : 'get',
      data: template ? { template } : undefined,
    })
      .then((response) => {
        const template = base64.decode(response.data)
        this.setState({ template })
      })
      .catch((error) => console.error('error', _get(error, 'response.data.error') || error))
      .then(() => this.setState({ isLoading: false }))
  }

  saveTemplate = () => {
   const template = base64.encode(this.state.template)
   this.templateRequest(template)
  }

  render() {
    const { documentName } = this.props
    const { isLoading, preview, template, documentPreview, activeTab } = this.state

    return (
      <Tabs className="tabs" onSelect={this.handleSelectTabs} activeKey={activeTab}>
        <Tab eventKey="template" title="Template">
          <Form.Control
            as="textarea"
            rows="20"
            value={template}
            onChange={event => this.setState({ template: event.target.value })}
          />
          <Button variant="primary" type="submit" disabled={isLoading} onClick={!isLoading ? this.saveTemplate : () => null}>
            {isLoading ? 'Loading…' : 'Save template'}
          </Button>
        </Tab>
        <Tab eventKey="preview" title="Preview">
          <div dangerouslySetInnerHTML={{__html: preview}} />
        </Tab>
        {!!documentName && <Tab eventKey={documentName} title={documentName}>
          <div dangerouslySetInnerHTML={{__html: documentPreview}} />
        </Tab>}
      </Tabs>
    )
  }
}

CustomTabs.propTypes = {
  documentName: PropTypes.string,
}

export default CustomTabs
