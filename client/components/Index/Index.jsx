import React, { Component } from 'react';

import Menu from 'components/Menu/Menu';
import Listado from 'components/Listado/Listado';
import firebase from 'config/firebase';

class IndexComponent extends Component {
  constructor() {
    super();

    this.items = firebase.database().ref().child('/proyectos/').once('value')
      .then(function(snapshot) {
        var records = [];

        snapshot.forEach(function(item) {
            records.push({item: item.val(), key: item.key});
        });
        
        return records;
    });
  }

  componentWillUnmount() {
    firebase.off();
  }

  render() {
    return (
      <div>
        <Menu width={200} id={"sidebar"} items={this.items}></Menu>
        <div className="o-container o-container--large o-container--main">
          <Listado items={this.items}></Listado>
        </div>
      </div>
    );
  }
}

export default IndexComponent;