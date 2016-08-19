import React, { Component } from 'react';
import { GridForm, Fieldset, Row, Field } from 'react-gridforms';

const _ = require('lodash');

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      YES_New: {
        checked: false
      },
      NO_New: {
        checked: false
      },
      YES_Budget: {
        checked: false
      },
      NO_Budget: {
        checked: false
      },
      YES_Interaction: {
        checked: false
      },
      NO_Interaction: {
        checked: false
      },
      YES_Hardware:{
        checked: false
      },
      NO_Hardware: {
        checked: false
      },
      YES_Infrastructure: {
        checked: false
      },
      NO_Infrastructure: {
        checked: false
      },
      YES_Webservices: {
        checked: false
      },
      NO_Webservices: {
        checked: false
      },
      YES_Design: {
        checked: false
      },
      NO_Design: {
        checked: false
      },
      YES_Content: {
        checked: false
      },
      NO_Content: {
        checked: false
      },
      YES_Installation: {
        checked: false
      },
      NO_Installation: {
        checked: false
      },
      Visibility: {
        value: undefined,
        hideInput: false
      }
    };
  }

  toggleDisabled(disabled) {
    return disabled ? 'disabled' : '';
  }

  toggleHidden(hidden) {
    return hidden ? 'hidden' : '';
  }

  handleCheckbox(e) {
    const split = e.target.id.split('_');

    if (split[0] === 'YES') {
      var opposite = 'NO_' + split[1];

      this.setState({ [e.target.id]: { checked: false } });
      this.setState({ [opposite]: { checked: true } });
    }
    else if (split[0] === 'NO') {
      var opposite = 'YES_' + split[1];

      this.setState({ [e.target.id]: { checked: false } });
      this.setState({ [opposite]: { checked: true } });
    }
  }

  handleDropdown(e) {
    if(e.target.value !== 'Otro') this.setState({ [e.target.id]: { hideInput: false } });
    else this.setState({ [e.target.id]: { hideInput: true } });
  }

  render() {
    return (
      <div>
        <GridForm>
          <Fieldset legend="Proyecto">
            <Row>
              <Field>
                <label>Tipo</label>
                <input id="YES_New" name="proyecto-nuevo" type="radio"/><label htmlFor="YES_New">Proyecto Nuevo</label>
                <input id="NO_New" name="proyecto-nuevo" type="radio"/><label htmlFor="NO_New">Proyecto Existente</label>
              </Field>
              <Field span={2}>
                <label>Nombre</label>
                <input type="text"/>
              </Field>
            </Row>
            <Row>
              <Field span={3}>
                <label>Área Solicitante</label>
                <input type="text"/>
              </Field>
              <Field>
                <label>Forma de contacto preferida</label>
                <select>
                  <option value="Telefono" title="Teléfono">Teléfono</option>
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
              <Field span={2}>
                <label>Nombre y Apellido</label>
                <input type="text" autoFocus/>
              </Field>
              <Field>
                <label>Cargo</label>
                <input type="text"/>
              </Field>
            </Row>
            <Row>
              <Field span={2}>
                <label>Teléfono</label>
                <input type="tel"/>
              </Field>
              <Field>
                <label>Interno</label>
                <input type="text"/>
              </Field>
              <Field span={2}>
                <label>Email</label>
                <input type="email"/>
              </Field>
            </Row>
            <Row>
              <Field span={3}>
                <label>Dirección</label>
                <input type="text"/>
              </Field>
              <Field>
                <label>Compromiso en horas</label>
                <input type="text"/>
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Requerimiento">
            <Row>
              <Field>
                <label>Tipo</label>
                <select>
                  <option value="Error" title="Error">Error</option>
                  <option value="Incidente" title="Incidente">Incidente</option>
                  <option value="Mejora" title="Mejora">Mejora</option>
                  <option value="Nueva Funcionalidad" title="Nueva Funcionalidad">Nueva Funcionalidad</option>
                  <option value="Nuevo Proyecto" title="Nuevo Proyecto">Nuevo Proyecto</option>
                </select>
              </Field>
              <Field>
                <label>Importancia</label>
                <select>
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
              <Field>
                <label>Descripción</label>
                <textarea></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Especificación de funciones</label>
                <textarea></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Visibilidad</label>
                <select id="Visibility" onChange={this.handleDropdown.bind(this)} value={this.state.Visibility.value}>
                  <option value="Ciudadanos" title="Ciudadanos">Ciudadanos</option>
                  <option value="Gobierno" title="Gobierno">Gobierno</option>
                  <option value="Ministerio" title="Ministerio">Ministerio</option>
                  <option value="Direccion" title="Dirección">Dirección</option>
                  <option value="Gerencia" title="Gerencia">Gerencia</option>
                  <option value="Area" title="Área">Área</option>
                  <option value="Otro" title="Otro">Otro</option>
                </select>
              </Field>
              <Field span={2} className={this.toggleDisabled(!this.state.Visibility.hideInput)} >
                <label>Otro</label>
                <input type="text" disabled={!this.state.NO_Budget.checked} />
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Detalles adicionales">
            <Row>
              <Field>
                <label>Restricciones</label>
                <textarea></textarea>
              </Field>
              <Field>
                <label>Riesgos detectados</label>
                <textarea></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Presupuesto asignado</label>
                <input id="YES_Budget" onChange={this.handleCheckbox.bind(this)} name="presupuesto-asignado" type="radio"/><label htmlFor="YES_Budget">Sí</label>
                <input id="NO_Budget" onChange={this.handleCheckbox.bind(this)} name="presupuesto-asignado" type="radio"/><label htmlFor="NO_Budget">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(!this.state.NO_Budget.checked)} >
                <label>Monto</label>
                <input type="text" disabled={!this.state.NO_Budget.checked} />
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere interacción con otras áreas o proyectos</label>
                <input id="YES_Interaction" onChange={this.handleCheckbox.bind(this)} name="requiere-interaccion" type="radio"/><label htmlFor="YES_Interaction">Sí</label>
                <input id="NO_Interaction" onChange={this.handleCheckbox.bind(this)} name="requiere-interaccion" type="radio"/><label htmlFor="NO_Interaction">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(!this.state.NO_Interaction.checked)} >
                <label>Describir</label>
                <input type="text" disabled={!this.state.NO_Interaction.checked} />
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Material de soporte">
            <Row>
              <Field>
                <label>Diagrama</label>
                <input type="url"/>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Documentos</label>
                <textarea></textarea>
              </Field>
              <Field>
                <label>Links</label>
                <textarea></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere hardware</label>
                <input id="YES_Hardware" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-hardware" type="radio"/><label htmlFor="YES_Hardware">Sí</label>
                <input id="NO_Hardware" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-hardware" type="radio"/><label htmlFor="NO_Hardware">No</label>
              </Field>
              <Field className={this.toggleDisabled(!this.state.NO_Hardware.checked)} >
                <label>Detalle</label>
                <select disabled={!this.state.NO_Hardware.checked} >
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere infraestructura</label>
                <input id="YES_Infrastructure" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-infraestructura" type="radio"/><label htmlFor="YES_Infrastructure">Sí</label>
                <input id="NO_Infrastructure" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-infraestructura" type="radio"/><label htmlFor="NO_Infrastructure">No</label>
              </Field>
              <Field className={this.toggleDisabled(!this.state.NO_Infrastructure.checked)} >
                <label>Detalle</label>
                <select disabled={!this.state.NO_Infrastructure.checked} >
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere webservices</label>
                <input id="YES_Webservices" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-webservices" type="radio"/><label htmlFor="YES_Webservices">Sí</label>
                <input id="NO_Webservices" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-webservices" type="radio"/><label htmlFor="NO_Webservices">No</label>
              </Field>
              <Field className={this.toggleDisabled(!this.state.NO_Webservices.checked)} >
                <label>Detalle</label>
                <select disabled={!this.state.NO_Webservices.checked} >
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere diseño</label>
                <input id="YES_Design" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-diseno" type="radio"/><label htmlFor="YES_Design">Sí</label>
                <input id="NO_Design" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-diseno" type="radio"/><label htmlFor="NO_Design">No</label>
              </Field>
              <Field className={this.toggleDisabled(!this.state.NO_Design.checked)} >
                <label>Detalle</label>
                <select disabled={!this.state.NO_Design.checked} >
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere contenido</label>
                <input id="YES_Content" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-contenido" type="radio"/><label htmlFor="YES_Content">Sí</label>
                <input id="NO_Content" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-contenido" type="radio"/><label htmlFor="NO_Content">No</label>
              </Field>
              <Field className={this.toggleDisabled(!this.state.NO_Content.checked)} >
                <label>Detalle</label>
                <select disabled={!this.state.NO_Content.checked} >
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere instalación</label>
                <input id="YES_Installation" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-instalacion" type="radio"/><label htmlFor="YES_Installation">Sí</label>
                <input id="NO_Installation" onChange={this.handleCheckbox.bind(this)} name="provee-o-necesita-instalacion" type="radio"/><label htmlFor="NO_Installation">No</label>
              </Field>
              <Field className={this.toggleDisabled(!this.state.NO_Installation.checked)} >
                <label>Detalle</label>
                <select disabled={!this.state.NO_Installation.checked} >
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
          </Fieldset>
        </GridForm>
        <div className="u-center-block">
          <div className="u-center-block__content u-center-block__content--horizontal">
            <button className="c-button c-button--block c-button--ghost c-button--large c-button--submit">Enviar</button>
          </div>
        </div>
      </div>
    );
  }
}

export default FormComponent;