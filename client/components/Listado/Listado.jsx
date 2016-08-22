import React, { Component } from 'react';

import Menu from 'components/Menu/Menu';
import ListItem from 'components/ListItem/ListItem';
import firebase from 'config/firebase';

import 'styles/Listado.css';

class ListadoComponent extends Component {
  constructor() {
    super();

    firebase.database().ref().child('/proyectos/').once('value').then(function(snapshot) {
      console.dir(snapshot.val());
    });
  }

  render() {
    return (
      <div>
        <ListItem></ListItem>
      </div>
    );
  }
}

export default ListadoComponent;