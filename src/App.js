import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import _get from 'lodash/get'

import http from './http'
import FormPicker from './form-picker'
import './app.scss'

class App extends Component {
  state = {
    isLoading: false,
    country: 'US',
    category: 'business',
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({ isLoading: true })

    const { country, category } = this.state

    http.request({
      data: { country, category },
      method: 'post',
    })
      .then((response) => {
        if (response.data) window.open(response.data)
      })
      .catch((error) => console.error('error', _get(error, 'response.data.error') || error))
      .then(() => this.setState({ isLoading: false }))
  }

  setValue = name => value => this.setState({ [name]: value })

  render() {
    const { isLoading } = this.state

    return  (
      <Container id="app">
        <h1>PDF News generator</h1>
        <Row>
          <Col>
            <Form onSubmit={!isLoading ? this.handleSubmit : null}>
              <FormPicker
                label="Country"
                values={['US', 'UK', 'PL']}
                checked={this.state['country']}
                onChange={this.setValue('country')}
                name="country"
              />
              <FormPicker
                label="Category"
                values={['business', 'sport']}
                checked={this.state['category']}
                onChange={this.setValue('category')}
                name="category"
              />
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Loading…' : 'Generate PDF'}
              </Button>
            </Form>
          </Col>
        </Row>
        <small>news data by newsapi.org</small>
      </Container>
    )
  }
}

export default App
