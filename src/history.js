import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import './history.scss'

export default class History extends PureComponent {
  openPDF = (id) => () => {
    this.props.onClick(id)
  }

  render() {
    const { documents } = this.props

    return (
      <div className="history alert alert-info">
        <h3>Previously generated:</h3>
        <ul>
          {documents.map(({
            id,
          }, index) => (
            <li key={index}>
              {id}
              <ButtonGroup aria-label="Basic example">
                <Button onClick={this.openPDF(id)}>PDF</Button>
                {/* <Button variant="secondary">HTML</Button> */}
              </ButtonGroup>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

History.propTypes = {
  documents: PropTypes.array,
  onClick: PropTypes.func,
}

History.defaultProps = {
  documents: [],
  onClick: () => null,
}
