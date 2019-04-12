import React, { Component } from 'react'
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
  }

  componentWillMount() {
    this.templateRequest()
  }

  handleSelectTabs = key => {
    if (key === 'preview') this.preparePreview()
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
    const { isLoading, preview, template } = this.state

    return (
      <Tabs className="tabs" onSelect={this.handleSelectTabs}>
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
      </Tabs>
    )
  }
}

export default CustomTabs
