import 'styles/Form.scss';

import React, { Component } from 'react';
import Form from 'components/Form/Form';
import Menu from 'components/Menu/Menu';

class NuevoComponent extends Component {
  render() {
    return (
      <div>
        <div className="o-container o-container--large o-container--main">
          <Form></Form>
        </div>
      </div>
    );
  }
}

export default NuevoComponent;
