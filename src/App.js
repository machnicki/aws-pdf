import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import _get from 'lodash/get'

import http from './http'
import './App.scss'

class App extends Component {
  state = {
    isLoading: false,
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({ isLoading: true })
    http.request({
      data: { country: this.$input1.value, category: this.$input2.value },
      method: 'post',
    })
      .then((response) => {
        console.log('response', response)
        if (response.data) window.open(response.data)
      })
      .catch((error) => console.error('error', _get(error, 'response.data.error') || error))
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    const { isLoading } = this.state

    return  (
      <div id="app">
        <h1>Get todays news</h1>
        <Form onSubmit={!isLoading ? this.handleSubmit : null}>
          <Form.Group controlId="coutry">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" defaultValue="US" ref={(ref) => this.$input1 = ref} required />
          </Form.Group>
    
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" defaultValue="business" ref={(ref) => this.$input2 = ref} required />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading…' : 'Generate PDF'}
          </Button>
        </Form>
      </div>
    )
  }
}

export default App
