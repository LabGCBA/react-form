import React, { Component } from 'react';
import { GridForm, Fieldset, Row, Field } from 'react-gridforms';

import Form from 'components/Form/Form';
import Menu from 'components/Menu/Menu';

class IndexComponent extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Menu width={200} id={"sidebar"}></Menu>
        <div className="o-container o-container--large o-container--main">
          <Form></Form>
        </div>
      </div>
    );
  }
}

export default IndexComponent;
