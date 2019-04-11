import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import _get from 'lodash/get'
import base64 from 'base-64'

import http from './http'
import './tabs.scss'

class CustomTabs extends Component {
  state = {
    isLoading: false,
    template: '',
  }

  componentWillMount() {
    this.templateRequest()
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
    const { isLoading, template } = this.state

    return (
      <Tabs className="tabs">
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
          Preview
        </Tab>
      </Tabs>
    )
  }
}

export default CustomTabs
