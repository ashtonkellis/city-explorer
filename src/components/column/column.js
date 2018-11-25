import React from 'react';

import './column.scss';

export default class Column extends React.Component {
  render() {
    return (
      <section>
        <h3>Results from the { this.props.apiName } API</h3>
        <ul>
          {this.props.children}
        </ul>
      </section>
    );
  }
}
