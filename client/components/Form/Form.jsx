/*jshint esnext: true */

import React, { Component } from 'react';
import { GridForm, Fieldset, Row, Field } from 'react-gridforms';

const validator = require( 'validator.js' ).validator();

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      YES_RADIO_New: {
        checked: true
      },
      NO_RADIO_New: {
        checked: false
      },
      YES_RADIO_Budget: {
        checked: false
      },
      NO_RADIO_Budget: {
        checked: true
      },
      YES_RADIO_Interaction: {
        checked: false
      },
      NO_RADIO_Interaction: {
        checked: true
      },
      YES_RADIO_Hardware:{
        checked: false
      },
      NO_RADIO_Hardware: {
        checked: true
      },
      YES_RADIO_Infrastructure: {
        checked: false
      },
      NO_RADIO_Infrastructure: {
        checked: true
      },
      YES_RADIO_WebServices: {
        checked: false
      },
      NO_RADIO_WebServices: {
        checked: true
      },
      YES_RADIO_Design: {
        checked: false
      },
      NO_RADIO_Design: {
        checked: true
      },
      YES_RADIO_Content: {
        checked: false
      },
      NO_RADIO_Content: {
        checked: true
      },
      YES_RADIO_Installation: {
        checked: false
      },
      NO_RADIO_Installation: {
        checked: true
      },
      SELECT_Visibility: {
        value: undefined,
        hideInput: false
      }
    };
  }

  toggleDisabled( disabled, otherClasses ) {
    return disabled ? 'disabled' : otherClasses;
  }

  handleCheckbox( e ) {
    const split = e.target.id.split('_');

    if (split[0] === 'YES') {
      let opposite = 'NO_RADIO_' + split[2];

      this.setState({ [e.target.id]: { checked: true } });
      this.setState({ [opposite]: { checked: false } });
    }
    else if (split[0] === 'NO') {
      let opposite = 'YES_RADIO_' + split[2];

      this.setState({ [e.target.id]: { checked: true } });
      this.setState({ [opposite]: { checked: false } });
    }
  }

  handleDropdown(e) {
    if(e.target.value !== 'Otro') this.setState({ [e.target.id]: { hideInput: false } });
    else this.setState({ [e.target.id]: { hideInput: true } });
  }

  render() {
    return (
      <div>
        <GridForm id="formProyectos">
          <Fieldset legend="Proyecto">
            <Row>
              <Field>
                <label>Tipo</label>
                <input id="YES_RADIO_New" name="proyectoNuevo" value="Proyecto nuevo" type="radio" checked={this.state.YES_RADIO_New.checked} onChange={this.handleCheckbox.bind(this)} /><label htmlFor="YES_RADIO_New">Proyecto Nuevo</label>
                <input id="NO_RADIO_New" name="proyectoNuevo" value="Proyecto nuevo" type="radio" checked={this.state.NO_RADIO_New.checked} onChange={this.handleCheckbox.bind(this)} /><label htmlFor="NO_RADIO_New">Proyecto Existente</label>
              </Field>
              <Field span={2} className="required">
                <label>Nombre</label>
                <input type="text" id="TEXT_Nombre" required={true} pattern="\S.*\S"/>
              </Field>
            </Row>
            <Row>
              <Field span={3} className="required">
                <label>Área Solicitante</label>
                <input type="text" id="TEXT_AreaSolicitante" required={true} pattern="\S.*\S"/>
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
              <Field span={2} className="required">
                <label>Nombre y Apellido</label>
                <input type="text" required={true} pattern="\S.*\S"/>
              </Field>
              <Field className="required">
                <label>Cargo</label>
                <input type="text" required={true} pattern="\S.*\S"/>
              </Field>
            </Row>
            <Row>
              <Field span={2} className="required">
                <label>Teléfono</label>
                <input type="tel" required={true} pattern="\S.*\S"/>
              </Field>
              <Field className="required">
                <label>Interno</label>
                <input type="number" required={true} min="0" step="1"/>
              </Field>
              <Field span={2} className="required">
                <label>Email</label>
                <input type="email" required={true} pattern="[^@\s]+@[^@\s]+\.[^@\s]+"/>
              </Field>
            </Row>
            <Row>
              <Field span={3} className="required">
                <label>Dirección</label>
                <input type="text" required={true} pattern="\S.*\S"/>
              </Field>
              <Field className="required">
                <label>Compromiso en horas</label>
                <input type="number" required={true} min="0" step="1"/>
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
              <Field className="required">
                <label>Descripción</label>
                <textarea></textarea>
              </Field>
            </Row>
            <Row>
              <Field className="required">
                <label>Especificación de funciones</label>
                <textarea></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Visibilidad</label>
                <select id="SELECT_Visibility" onChange={this.handleDropdown.bind(this)} value={this.state.SELECT_Visibility.value}>
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
                <input type="text" disabled={!this.state.SELECT_Visibility.hideInput} />
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
                <input id="YES_RADIO_Budget" checked={this.state.YES_RADIO_Budget.checked} onChange={this.handleCheckbox.bind(this)} name="presupuestoAsignado" type="radio"/>
                <label htmlFor="YES_RADIO_Budget">Sí</label>
                <input id="NO_RADIO_Budget" checked={this.state.NO_RADIO_Budget.checked} onChange={this.handleCheckbox.bind(this)} name="presupuestoAsignado" type="radio"/>
                <label htmlFor="NO_RADIO_Budget">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(this.state.NO_RADIO_Budget.checked, 'required')}>
                <label>Monto</label>
                <input type="text" disabled={this.state.NO_RADIO_Budget.checked}  required={this.state.YES_RADIO_Budget.checked}/>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere interacción con otras áreas o proyectos</label>
                <input id="YES_RADIO_Interaction" checked={this.state.YES_RADIO_Interaction.checked} onChange={this.handleCheckbox.bind(this)} name="requiereInteraccion" type="radio"/>
                <label htmlFor="YES_RADIO_Interaction">Sí</label>
                <input id="NO_RADIO_Interaction" checked={this.state.NO_RADIO_Interaction.checked} onChange={this.handleCheckbox.bind(this)} name="requiereInteraccion" type="radio"/>
                <label htmlFor="NO_RADIO_Interaction">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(this.state.NO_RADIO_Interaction.checked, 'required')}>
                <label>Describir</label>
                <input type="text" disabled={this.state.NO_RADIO_Interaction.checked} required={this.state.YES_RADIO_Interaction.checked}/>
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
                <input id="YES_RADIO_Hardware" checked={this.state.YES_RADIO_Hardware.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaHardware" type="radio"/>
                <label htmlFor="YES_RADIO_Hardware">Sí</label>
                <input id="NO_RADIO_Hardware" checked={this.state.NO_RADIO_Hardware.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaHardware" type="radio"/>
                <label htmlFor="NO_RADIO_Hardware">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Hardware.checked)}>
                <label>Detalle</label>
                <select disabled={this.state.NO_RADIO_Hardware.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere infraestructura</label>
                <input id="YES_RADIO_Infrastructure" checked={this.state.YES_RADIO_Infrastructure.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaInfraestructura" type="radio"/>
                <label htmlFor="YES_RADIO_Infrastructure">Sí</label>
                <input id="NO_RADIO_Infrastructure" checked={this.state.NO_RADIO_Infrastructure.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaInfraestructura" type="radio"/>
                <label htmlFor="NO_RADIO_Infrastructure">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Infrastructure.checked)}>
                <label>Detalle</label>
                <select disabled={this.state.NO_RADIO_Infrastructure.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere webservices</label>
                <input id="YES_RADIO_WebServices" checked={this.state.YES_RADIO_WebServices.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaWebServices" type="radio"/>
                <label htmlFor="YES_RADIO_WebServices">Sí</label>
                <input id="NO_RADIO_WebServices" checked={this.state.NO_RADIO_WebServices.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaWebServices" type="radio"/>
                <label htmlFor="NO_RADIO_WebServices">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_WebServices.checked)}>
                <label>Detalle</label>
                <select disabled={this.state.NO_RADIO_WebServices.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere diseño</label>
                <input id="YES_RADIO_Design" checked={this.state.YES_RADIO_Design.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaDiseno" type="radio"/>
                <label htmlFor="YES_RADIO_Design">Sí</label>
                <input id="NO_RADIO_Design" checked={this.state.NO_RADIO_Design.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaDiseno" type="radio"/>
                <label htmlFor="NO_RADIO_Design">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Design.checked)}>
                <label>Detalle</label>
                <select disabled={this.state.NO_RADIO_Design.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere contenido</label>
                <input id="YES_RADIO_Content" checked={this.state.YES_RADIO_Content.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaContenido" type="radio"/>
                <label htmlFor="YES_RADIO_Content">Sí</label>
                <input id="NO_RADIO_Content" checked={this.state.NO_RADIO_Content.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaContenido" type="radio"/>
                <label htmlFor="NO_RADIO_Content">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Content.checked)}>
                <label>Detalle</label>
                <select disabled={this.state.NO_RADIO_Content.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere instalación</label>
                <input id="YES_RADIO_Installation" checked={this.state.YES_RADIO_Installation.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaInstalacion" type="radio"/>
                <label htmlFor="YES_RADIO_Installation">Sí</label>
                <input id="NO_RADIO_Installation" checked={this.state.NO_RADIO_Installation.checked} onChange={this.handleCheckbox.bind( this ) } name="proveeONecesitaInstalacion" type="radio"/>
                <label htmlFor="NO_RADIO_Installation">No</label>
              </Field>
              <Field className={this.toggleDisabled(this.state.NO_RADIO_Installation.checked)}>
                <label>Detalle</label>
                <select disabled={this.state.NO_RADIO_Installation.checked}>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
          </Fieldset>
        </GridForm>
        <div className="u-center-block">
          <div className="u-center-block__content u-center-block__content--horizontal">
            <button type="submit" form="formProyectos" className="c-button c-button--block c-button--ghost c-button--large c-button--submit">Enviar</button>
          </div>
        </div>
      </div>
    );
  }
}

export default FormComponent;