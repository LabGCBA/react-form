/*jshint esnext: true */

import 'styles/Listado.scss';

import React, { Component } from 'react';
import Menu from 'components/Menu/Menu';
import ListItem from 'components/ListItem/ListItem';

class ListadoComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {items: []};
  }

  componentDidMount() {
    this.props.items.then(function(result) {
      this.setState({items: result});
    }.bind(this));
  }

  render() {
    if (this.state.items) {
      var listItems = this.state.items.map(function(element) {
        return (
          <ListItem element={element} key={element.key}></ListItem>
        );
      });
    }
    else {
      var listItems = <div class="u-absolute-center"><h1 className='noItemsMessage'>No hay proyectos cargados</h1></div>
    }

    return (
      <div>
        {listItems}
      </div>
    );
  }
}

export default ListadoComponent;