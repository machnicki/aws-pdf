import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'

import './form-picker.scss'

export default class FormPicker extends PureComponent {
  handleChange = (value) => () => {
    const _value = value === 'other' ? this.$input.value : value
    this.props.onChange(_value)
  }

  handleInputRef = ($input) => {
    this.$input = $input
  }

  render() {
    const { label, name, values, checked } = this.props

    return (
      <Form.Group controlId={name} className="form-picker">
        <Form.Label>{label}</Form.Label>
        {values.map((value, key) => (
          <Form.Check
            key={key}
            checked={value===checked}
            inline
            label={value}
            type="radio"
            id={`${name}-${value}`}
            onChange={this.handleChange(value)}
          />
        ))}
        <Form.Check inline id={`${name}-other`}>
          <Form.Check.Label>
            <Form.Check.Input
              type="radio"
              onChange={this.handleChange('other')}
              checked={!values.includes(checked)}
            />
            <Form.Control
              ref={this.handleInputRef}
              type="text"
              name="country"
              onClick={this.handleChange('other')}
              onChange={this.handleChange('other')}
              required={!values.includes(checked)}
            />
          </Form.Check.Label>
        </Form.Check>
      </Form.Group>
    )
  }
}

FormPicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
}

FormPicker.defaultProps = {
  values: [],
  onChange: () => null,
}
