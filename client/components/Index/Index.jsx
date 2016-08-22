import React, { Component } from 'react';

import Menu from 'components/Menu/Menu';
import Listado from 'components/Listado/Listado';

class IndexComponent extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Menu width={200} id={"sidebar"}></Menu>
        <div className="o-container o-container--large o-container--main">
          <Listado></Listado>
        </div>
      </div>
    );
  }
}

export default IndexComponent;