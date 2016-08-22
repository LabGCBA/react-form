import React, { Component } from 'react';
var Menu = require( 'react-burger-menu' ).slide;

class MenuComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {items: []};
  }

  componentDidMount() {
    if (this.props.items) {
        this.props.items.then(function(result) {
          this.setState({items: result});
      }.bind(this));
    }
  }

  render() {
    if (this.state.items.length > 0) {
      var submenuItems = this.state.items.map(function(element) {
        return (
          <a key={element.key} className="bm-menu-subitem" href={'/#' + element.key}>{element.item.proyecto.nombre}</a>
        );
      });
    }

    return (
      <Menu>
        <a className="bm-menu-item" href="/nuevo">Agregar proyecto</a>
        <a className="bm-menu-item" href="/">Ver proyectos</a>
        {submenuItems ? submenuItems : <br/>}
      </Menu>
    );
  }
}

export default MenuComponent;