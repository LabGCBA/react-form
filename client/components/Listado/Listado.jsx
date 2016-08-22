import React, { Component } from 'react';

import Menu from 'components/Menu/Menu';
import firebase from 'config/firebase';

class ListadoComponent extends Component {
  constructor() {
    super();

    firebase.database().ref().child('/proyectos/').once('value').then(function(snapshot) {
      console.dir(snapshot.val());
      // ...
    });
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export default ListadoComponent;