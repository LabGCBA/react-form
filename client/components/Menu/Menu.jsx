import React, { Component } from 'react';
var Menu = require( 'react-burger-menu' ).slide;

class MenuComponent extends Component {
  render() {
    return (
      <Menu>
        <a id="home" className="menu-item" href="/nuevo">Agregar proyecto</a>
        <a id="about" className="menu-item" href="/">Ver proyectos</a>
      </Menu>
    );
  }
}

export default MenuComponent;