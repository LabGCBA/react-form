/*jshint esnext: true */

import React, { Component } from 'react';
import { GridForm, Fieldset, Row, Field } from 'react-gridforms';
import firebase from 'config/firebase';

const serialize = require('form-serialize');
const shortid = require('shortid');
const qwest = require('qwest');

class FormComponent extends Component {
  constructor(props) {
    super( props );

    this.state = {
      YES_RADIO_New: {
        checked: true,
        fieldset: 'proyecto'
      },
      NO_RADIO_New: {
        checked: false,
        fieldset: 'proyecto'
      },
      YES_RADIO_Budget: {
        checked: false,
        fieldset: 'detallesAdicionales'
      },
      NO_RADIO_Budget: {
        checked: true,
        fieldset: 'detallesAdicionales'
      },
      YES_RADIO_Interaction: {
        checked: false,
        fieldset: 'detallesAdicionales'
      },
      NO_RADIO_Interaction: {
        checked: true,
        fieldset: 'detallesAdicionales'
      },
      YES_RADIO_Hardware:{
        checked: false,
        fieldset: 'materialDeSoporte'
      },
      NO_RADIO_Hardware: {
        checked: true,
        fieldset: 'materialDeSoporte'
      },
      YES_RADIO_Infrastructure: {
        checked: false,
        fieldset: 'materialDeSoporte'
      },
      NO_RADIO_Infrastructure: {
        checked: true,
        fieldset: 'materialDeSoporte'
      },
      YES_RADIO_WebServices: {
        checked: false,
        fieldset: 'materialDeSoporte'
      },
      NO_RADIO_WebServices: {
        checked: true,
        fieldset: 'materialDeSoporte'
      },
      YES_RADIO_Design: {
        checked: false,
        fieldset: 'materialDeSoporte'
      },
      NO_RADIO_Design: {
        checked: true,
        fieldset: 'materialDeSoporte'
      },
      YES_RADIO_Content: {
        checked: false,
        fieldset: 'materialDeSoporte'
      },
      NO_RADIO_Content: {
        checked: true,
        fieldset: 'materialDeSoporte'
      },
      YES_RADIO_Installation: {
        checked: false,
        fieldset: 'materialDeSoporte'
      },
      NO_RADIO_Installation: {
        checked: true,
        fieldset: 'materialDeSoporte'
      },
      SELECT_Visibility: {
        value: undefined,
        hideInput: false,
        fieldset: 'requerimiento'
      }
    };
  }

  toggleDisabled( disabled, otherClasses ) {
    return disabled ? 'disabled' : otherClasses;
  }

  handleCheckbox( e ) {
    const split = e.target.id.split( '_' );
    var opposite;

    if (split[0] === 'YES') opposite = 'NO_RADIO_' + split[2];
    else if (split[0] === 'NO') opposite = 'YES_RADIO_' + split[2];

    this.setState( { [ e.target.id ]: { checked: true } });
    this.setState( { [ opposite ]: { checked: false } });
  }

  handleDropdown(e) {
    if (e.target.value !== 'Otro') this.setState({ [e.target.id]: { hideInput: false } });
    else this.setState({ [e.target.id]: { hideInput: true } });
  }

  handleSubmit(e) {
    e.preventDefault();

    var data = serialize(e.target, { hash: true, empty: true });

    if (data.materialDeSoporte.documentos.length > 0) data.materialDeSoporte.documentos = data.materialDeSoporte.documentos.split( /\r?\n/ );
    if (data.materialDeSoporte.links.length > 0) data.materialDeSoporte.links = data.materialDeSoporte.links.split( /\r?\n/ );

    const result = this.sendData(data);
    const backend = 'http://localhost:5000/mail';

    result.then((value) => {
      document.getElementById("proyectos").reset();

      qwest.post(backend, {
        projectName: data.proyecto.nombre,
        projectRequestingArea: data.proyecto.areaSolicitante,
        projectDescription: data.requerimiento.descripcion
    }, {
        cache: true
    })
      .then(function(xhr, response) {
          alert('Formulario enviado exitosamente.');
      })
      .catch(function(e, xhr, response) {
        console.error(e);
      });
      });
  }

  sendData( data ) {
    const id = shortid.generate();
    return firebase.database().ref().push(data);
  }

  render() {
    return (
      <div>
        <GridForm id="proyectos" onSubmit={this.handleSubmit.bind(this)}>
          <Fieldset legend="Proyecto">
            <Row>
              <Field>
                <label>Tipo</label>
                <input id="YES_RADIO_New" name="proyecto[tipo]" value='Proyecto nuevo' type="radio" checked={this.state.YES_RADIO_New.checked} onChange={this.handleCheckbox.bind( this ) } />
                <label htmlFor="YES_RADIO_New">Proyecto Nuevo</label>
                <input id="NO_RADIO_New" name="proyecto[tipo]" value='Proyecto existente' type="radio" checked={this.state.NO_RADIO_New.checked} onChange={this.handleCheckbox.bind( this ) } />
                <label htmlFor="NO_RADIO_New">Proyecto Existente</label>
              </Field>
              <Field span={2} className="required">
                <label>Nombre</label>
                <input type="text" name="proyecto[nombre]" required={true} pattern=".*\S+.*"/>
              </Field>
            </Row>
            <Row>
              <Field span={3} className="required">
                <label>Área Solicitante</label>
                <input type="text" name="proyecto[areaSolicitante]" required={true} pattern=".*\S+.*"/>
              </Field>
              <Field>
                <label>Forma de contacto preferida</label>
                <select name="proyecto[formaDeContactoPreferida]">
                  <option value="Teléfono" title="Teléfono">Teléfono</option>
                  <option value="Email" title="Email">Email</option>
                  <option value="Persona" title="Persona">Persona</option>
                </select>
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Contacto">
            <Row>
              <Field span={2} className="required">
                <label>Nombre y Apellido</label>
                <input type="text" name="contacto[nombreYApellido]" required={true} pattern=".*\S+.*"/>
              </Field>
              <Field className="required">
                <label>Cargo</label>
                <input type="text" name="contacto[cargo]" required={true} pattern=".*\S+.*"/>
              </Field>
            </Row>
            <Row>
              <Field span={2} className="required">
                <label>Teléfono</label>
                <input type="tel" name="contacto[telefono]" required={true} pattern=".*\S+.*"/>
              </Field>
              <Field className="required">
                <label>Interno</label>
                <input type="number" name="contacto[interno]" required={true} min="0" step="1"/>
              </Field>
              <Field span={2} className="required">
                <label>Email</label>
                <input type="email" name="contacto[email]" required={true} pattern="[^@\s]+@[^@\s]+\.[^@\s]+"/>
              </Field>
            </Row>
            <Row>
              <Field span={3} className="required">
                <label>Dirección</label>
                <input type="text" name="contacto[direccion]" required={true} pattern=".*\S+.*"/>
              </Field>
              <Field className="required">
                <label>Compromiso en horas</label>
                <input type="number" name="contacto[compromisoEnHoras]" required={true} min="0" step="0.5"/>
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Requerimiento">
            <Row>
              <Field>
                <label>Tipo</label>
                <select name="requerimiento[tipo]">
                  <option value="Error" title="Error">Error</option>
                  <option value="Incidente" title="Incidente">Incidente</option>
                  <option value="Mejora" title="Mejora">Mejora</option>
                  <option value="Nueva Funcionalidad" title="Nueva Funcionalidad">Nueva Funcionalidad</option>
                  <option value="Nuevo Proyecto" title="Nuevo Proyecto">Nuevo Proyecto</option>
                </select>
              </Field>
              <Field>
                <label>Importancia</label>
                <select name="requerimiento[importancia]">
                  <option value="0" title="Critico">0 – Crítico (afecta las funciones de todos los que utilizan el desarrollo)</option>
                  <option value="1" title="Urgente">1 – Urgente (afecta las funciones de la mayoría de los que utilizan el desarrollo)</option>
                  <option value="2" title="Grave">2 – Grave (afecta las funciones de algunos de los que utilizan el desarrollo)</option>
                  <option value="3" title="Media">3 – Media (se puede replicar el problema en todos los casos, pero no frena el uso)</option>
                  <option value="4" title="Baja">4 – Baja (no frena el uso, sucede erráticamente)</option>
                  <option value="5" title="Muy Baja">5 – Muy Baja</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field className="required">
                <label>Descripción</label>
                <textarea name="requerimiento[descripcion]" required={true} pattern=".*\S+.*"></textarea>
              </Field>
            </Row>
            <Row>
              <Field className="required">
                <label>Especificación de funciones</label>
                <textarea name="requerimiento[especificacionDeFunciones]" required={true} pattern=".*\S+.*"></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Visibilidad</label>
                <select id="SELECT_Visibility" name="requerimiento[visibilidad][]" onChange={this.handleDropdown.bind(this)} value={this.state.SELECT_Visibility.value}>
                  <option value="Ciudadanos" title="Ciudadanos">Ciudadanos</option>
                  <option value="Gobierno" title="Gobierno">Gobierno</option>
                  <option value="Ministerio" title="Ministerio">Ministerio</option>
                  <option value="Direccion" title="Dirección">Dirección</option>
                  <option value="Gerencia" title="Gerencia">Gerencia</option>
                  <option value="Area" title="Área">Área</option>
                  <option value="Otro" title="Otro">Otro</option>
                </select>
              </Field>
              <Field span={2} className={this.toggleDisabled(!this.state.SELECT_Visibility.hideInput, 'required')}>
                <label>Otro</label>
                <input type="text" name="requerimiento[visibilidad][]" required={!this.state.SELECT_Visibility.hideInput} disabled={!this.state.SELECT_Visibility.hideInput} />
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Detalles adicionales">
            <Row>
              <Field>
                <label>Restricciones</label>
                <textarea name="detallesAdicicionales[restricciones]"></textarea>
              </Field>
              <Field>
                <label>Riesgos detectados</label>
                <textarea name="detallesAdicicionales[riesgosDetectados]"></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Presupuesto asignado</label>
                <input id="YES_RADIO_Budget" name="detallesAdicicionales[presupuestoAsignado][]" value={true} checked={this.state.YES_RADIO_Budget.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="YES_RADIO_Budget">Sí</label>
                <input id="NO_RADIO_Budget"name="detallesAdicicionales[presupuestoAsignado][]"value={false} checked={this.state.NO_RADIO_Budget.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="NO_RADIO_Budget">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(this.state.NO_RADIO_Budget.checked, 'required')}>
                <label>Monto</label>
                <input type="number" className="currency" name="detallesAdicicionales[presupuestoAsignado][]" required={true} min="0" step="0.01" disabled={this.state.NO_RADIO_Budget.checked}  required={this.state.YES_RADIO_Budget.checked}/>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere interacción con otras áreas o proyectos</label>
                <input id="YES_RADIO_Interaction" name="detallesAdicicionales[requiereInteraccionConOtrasAreasOProyectos][]" value={true} checked={this.state.YES_RADIO_Interaction.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="YES_RADIO_Interaction">Sí</label>
                <input id="NO_RADIO_Interaction" name="detallesAdicicionales[requiereInteraccionConOtrasAreasOProyectos][]" value={false} checked={this.state.NO_RADIO_Interaction.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="NO_RADIO_Interaction">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(this.state.NO_RADIO_Interaction.checked, 'required')}>
                <label>Describir</label>
                <input type="text" name="detallesAdicicionales[requiereInteraccionConOtrasAreasOProyectos][]" disabled={this.state.NO_RADIO_Interaction.checked} required={this.state.YES_RADIO_Interaction.checked}/>
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Material de soporte">
            <Row>
              <Field>
                <label>Diagrama</label>
                <input type="url" name="materialDeSoporte[diagrama]"/>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Documentos</label>
                <textarea name="materialDeSoporte[documentos]"></textarea>
              </Field>
              <Field>
                <label>Links</label>
                <textarea name="materialDeSoporte[links]"></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere hardware</label>
                <input id="YES_RADIO_Hardware" name="materialDeSoporte[requiereHardware][]" value={true} checked={this.state.YES_RADIO_Hardware.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Hardware">Sí</label>
                <input id="NO_RADIO_Hardware" name="materialDeSoporte[requiereHardware][]" value={false} checked={this.state.NO_RADIO_Hardware.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="NO_RADIO_Hardware">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Hardware.checked)}>
                <label>Detalle</label>
                <select name="materialDeSoporte[requiereHardware][]" disabled={this.state.NO_RADIO_Hardware.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere infraestructura</label>
                <input id="YES_RADIO_Infrastructure" name="materialDeSoporte[requiereInfraestructura][]" value={true} checked={this.state.YES_RADIO_Infrastructure.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Infrastructure">Sí</label>
                <input id="NO_RADIO_Infrastructure" name="materialDeSoporte[requiereInfraestructura][]" value={false} checked={this.state.NO_RADIO_Infrastructure.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="NO_RADIO_Infrastructure">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Infrastructure.checked)}>
                <label>Detalle</label>
                <select name="materialDeSoporte[requiereInfraestructura][]" disabled={this.state.NO_RADIO_Infrastructure.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere webservices</label>
                <input id="YES_RADIO_WebServices" name="materialDeSoporte[requiereWebServices][]" value={true} checked={this.state.YES_RADIO_WebServices.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_WebServices">Sí</label>
                <input id="NO_RADIO_WebServices" name="materialDeSoporte[requiereWebServices][]" value={false} checked={this.state.NO_RADIO_WebServices.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="NO_RADIO_WebServices">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_WebServices.checked)}>
                <label>Detalle</label>
                <select name="materialDeSoporte[requiereWebServices][]" disabled={this.state.NO_RADIO_WebServices.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere diseño</label>
                <input id="YES_RADIO_Design" name="materialDeSoporte[requiereDiseno][]" value={true} checked={this.state.YES_RADIO_Design.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Design">Sí</label>
                <input id="NO_RADIO_Design" name="materialDeSoporte[requiereDiseno][]" value={false} checked={this.state.NO_RADIO_Design.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="NO_RADIO_Design">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Design.checked)}>
                <label>Detalle</label>
                <select name="materialDeSoporte[requiereDiseno][]" disabled={this.state.NO_RADIO_Design.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere contenido</label>
                <input id="YES_RADIO_Content" name="materialDeSoporte[requiereContenido][]" value={true} checked={this.state.YES_RADIO_Content.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Content">Sí</label>
                <input id="NO_RADIO_Content" name="materialDeSoporte[requiereContenido][]" value={false} checked={this.state.NO_RADIO_Content.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="NO_RADIO_Content">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Content.checked)}>
                <label>Detalle</label>
                <select name="materialDeSoporte[requiereContenido][]" disabled={this.state.NO_RADIO_Content.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere instalación</label>
                <input id="YES_RADIO_Installation" name="materialDeSoporte[requiereInstalacion][]" value={true} checked={this.state.YES_RADIO_Installation.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Installation">Sí</label>
                <input id="NO_RADIO_Installation" name="materialDeSoporte[requiereInstalacion][]" value={false} checked={this.state.NO_RADIO_Installation.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="NO_RADIO_Installation">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Installation.checked)}>
                <label>Detalle</label>
                <select name="materialDeSoporte[requiereInstalacion][]" disabled={this.state.NO_RADIO_Installation.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
          </Fieldset>
        </GridForm>
        <div className="u-center-block">
          <div className="u-center-block__content u-center-block__content--horizontal">
            <button type="submit" form="proyectos" className="c-button c-button--block c-button--ghost c-button--large c-button--submit">Enviar</button>
          </div>
        </div>
      </div>
    );
  }
}

export default FormComponent;