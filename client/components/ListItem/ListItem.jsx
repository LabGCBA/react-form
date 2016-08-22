/*jshint esnext: true */

import React, { Component } from 'react';

import Menu from 'components/Menu/Menu';

class ListItemComponent extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="grid-form">
      <fieldset>
        <legend>Proyecto</legend>
        <div data-row-span="3">
            <div data-field-span="1">
              <label>Tipo</label>
              <span>Datos de ejemplo</span>
            </div>
            <div data-field-span="2" >
                <label>Nombre</label>
            </div>
        </div>
        <div data-row-span="4">
            <div data-field-span="3">
              <label>Área Solicitante</label>
              <span>Area de ejemplo</span>
            </div>
            <div data-field-span="1">
                <label>Forma de contacto preferida</label>
            </div>
        </div>
      </fieldset>
    </div>
    );
  }
}

export default ListItemComponent;