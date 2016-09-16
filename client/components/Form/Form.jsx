/*jshint esnext: true */

import React, { Component } from 'react';
import { GridForm, Fieldset, Row, Field } from 'react-gridforms';
import firebase from 'config/firebase';
import DropzoneComponent from 'react-dropzone-component';
import ProgressButton from 'react-progress-button';

const serialize = require('form-serialize');
const shortid = require('shortid');
const qwest = require('qwest');
const ReactDOM = require('react-dom');

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
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
        disableInput: true
      }
    };

    this.state = this.initialState;
    this.projectBackend = 'http://localhost:5000/project'; //TODO: Replace this
    this.fileBackend = 'http://localhost:5000/upload'; //TODO: Replace this
    this.nombreProyecto = '';
    this.diagram = '';
    this.documents = [];
    this.dropzones = [];
    this.formSent = false;
    this.formIsValid = false;

    this.dropzoneConfig = {
      acceptedFiles: [
        '.rar', '.zip', '.jpg', '.png', '.docx', '.doc', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf'
        ],
      showFiletypeIcon: false,
      postUrl: this.fileBackend
    };

    this.dropzoneDiagramEventHandlers = {
      init: (dropzone) => this.dropzones.push(dropzone),
      // All of these receive the event as first parameter:
      drop: null,
      dragstart: null,
      dragend: null,
      dragenter: null,
      dragover: null,
      dragleave: null,
      // All of these receive the file as first parameter:
      addedfile: null,
      thumbnail: null,
      error: null,
      processing: null,
      uploadprogress: null,   
      complete: null,
      canceled: null,
      maxfilesreached: null,
      maxfilesexceeded: null,
      // All of these receive a list of files as first parameter
      // and are only called if the uploadMultiple option
      // in djsConfig is true:
      processingmultiple: null,
      successmultiple: null,
      completemultiple: null,
      canceledmultiple: null,
      // Special Events
      totaluploadprogress: null,
      reset: null,
      queuecomplete: null,
      removedfile: (file) => {
        if (!this.formSent) {
            qwest.delete(this.fileBackend, {
              projectName: this.nombreProyecto,
              fileName: file.name,
              formSent: this.formSent
            })
            .then((xhr, res) => {
              if (this.diagram === filename) this.diagram = '';
              else this.documents.splice(this.documents.indexOf(file.name), 1);
            })
            .catch(function(e, xhr, response) {
              console.error('Error removing file');
              console.error(e);
            });
        }
      },
      success: (file) => {
        this.diagram = file.name;
      }
    };

    this.dropzoneDocsEventHandlers = {
      init: (dropzone) => this.dropzones.push(dropzone),
      removedfile: (file) => {
        if (!this.formSent) {
          qwest.delete(this.fileBackend, {
            projectName: this.nombreProyecto,
            fileName: file.name
          })
          .then(() => {
            if (this.documents.indexOf(file.name) > -1) {
              this.documents.splice(this.documents.indexOf(file.name), 1);
            }
          })
          .catch(function(e, xhr, response) {
            console.error('Error removing file');
            console.error(e);
          });
        }
      },
      successmultiple: (files) => {
        files.forEach(function(file) {
          this.documents.push(file.name);
        }, this);
      },
    };

    this.dropzoneJSConfigBase = {
      maxfilesize: 200,
      addRemoveLinks: true,
      dictDefaultMessage: 'Arrastrar un archivo aquí (o hacer click para buscarlo)',
      dictCancelUpload: 'Cancelar',
      dictCancelUploadConfirmation: 'Cancelar la subida?',
      dictRemoveFile: 'Sacar',
      dictInvalidFileType: 'Ese tipo de archivo no está permitido',
      acceptedFiles: 
        'application/x-rar-compressed,application/zip,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf'
    };

    this.dropzoneJSConfig = Object.assign({}, this.dropzoneJSConfigBase, {
      uploadMultiple: false,
      maxFiles: 1,
    });

    this.dropzoneJSConfigMulti = Object.assign({}, this.dropzoneJSConfigBase, {
      uploadMultiple: true
    });
  }

  componentWillUnmount() {
    firebase.off();
  }

  toggleDisabled(disabled, otherClasses) {
    return disabled ? 'disabled' : otherClasses;
  }

  handleCheckbox(e) {
    const split = e.target.id.split( '_' );
    var opposite;

    if (split[0] === 'YES') opposite = 'NO_RADIO_' + split[2];
    else if (split[0] === 'NO') opposite = 'YES_RADIO_' + split[2];

    this.setState( { [ e.target.id ]: { checked: true } });
    this.setState( { [ opposite ]: { checked: false } });
  }

  handleDropdown(e) {
    if (e.target.value !== 'Otro') this.setState({ [e.target.id]: { disableInput: true } });
    else this.setState({ [e.target.id]: { disableInput: false } });
  }

  handleSubmit(e) {
    ReactDOM.findDOMNode(this.refs.form).dispatchEvent(new Event('submit'));

    if (this.formIsValid) {
      this.formSent = true;

      var data = this.getData();
      var promise = this.sendData(data);

      promise.then((value) => {
        qwest.post(this.projectBackend, {
          data: data
        }, {
          cache: false
        })
        .then(function(xhr, response) {
          this.formSent = false;
          this.reset();
        }.bind(this))
        .catch(function(e, xhr, response) {
          alert('Hubo un error y no se pudo enviar el formulario.\nIntente de nuevo.');

          console.error(e);
          console.dir(response);
          this.formSent = false;
        }.bind(this));
      });

      return promise;
    }
  }

  handleNombreProyecto(e) {
    this.nombreProyecto = e.target.value;
  }

  handleClose(e) {
    if (this.documents.length > 0 || this.diagram !== '') {
      confirm('No se ha enviado el formulario. Seguro que desea cerrar la pestaña?');

      qwest.post(this.fileBackend, {
        all: true,
      });
    }
  }

  validate(e) {
    e.preventDefault;
    this.formIsValid = true;
  }

  sendData(data) {
    const id = shortid.generate();
    return firebase.database().ref().child('/proyectos/').child(id).set(data);
  }

  getData() {
    var form = document.getElementById('proyectos'); 
    var data = serialize(form, {hash: true, empty: true});
    
    data.materialDeSoporte.diagrama = this.diagram;
    data.materialDeSoporte.documentos = this.documents.join('\n');
    if (data.materialDeSoporte.links.length > 0) data.materialDeSoporte.links = data.materialDeSoporte.links.split( /\r?\n/ );

    return data;
  }

  reset() {
    var form = document.getElementById('proyectos'); 

    this.dropzones.forEach(function(dropzone) {
      dropzone.removeAllFiles();
    }, this);
    this.formIsValid = false;
    this.diagram = '';
    this.documents = [];
    form.reset();

    this.setState(this.initialState);
  }

  render() {
    return (
      <div>
        <GridForm id="proyectos" ref="form" onSubmit={this.validate.bind(this)}>
          <Fieldset legend="Proyecto">
            <Row>
              <Field>
                <label>Tipo</label>
                <div className="radio-container">
                  <input id="YES_RADIO_New" className="radiobox-focus" name="proyecto[tipo]" value='Proyecto nuevo' type="radio" checked={this.state.YES_RADIO_New.checked} onChange={this.handleCheckbox.bind( this ) } />
                  <label htmlFor="YES_RADIO_New">Proyecto Nuevo</label>
                </div>
                <div className="radio-container">
                  <input id="NO_RADIO_New" className="radiobox-focus" name="proyecto[tipo]" value='Proyecto existente' type="radio" checked={this.state.NO_RADIO_New.checked} onChange={this.handleCheckbox.bind( this ) } />
                  <label htmlFor="NO_RADIO_New">Proyecto Existente</label>
                </div>
              </Field>
              <Field span={2} className="required">
                <label>Nombre</label>
                <input type="text" name="proyecto[nombre]" required={true} pattern=".*\S+.*" onKeyUp={this.handleNombreProyecto.bind(this)}/>
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
                <select id="SELECT_Visibility" name="requerimiento[visibilidad][]" onChange={this.handleDropdown.bind(this)}>
                  <option value="Ciudadanos" title="Ciudadanos">Ciudadanos</option>
                  <option value="Gobierno" title="Gobierno">Gobierno</option>
                  <option value="Ministerio" title="Ministerio">Ministerio</option>
                  <option value="Direccion" title="Dirección">Dirección</option>
                  <option value="Gerencia" title="Gerencia">Gerencia</option>
                  <option value="Area" title="Área">Área</option>
                  <option value="Otro" title="Otro">Otro</option>
                </select>
              </Field>
              <Field span={2} className={this.toggleDisabled(this.state.SELECT_Visibility.disableInput, 'required')}>
                <label>Otro</label>
                <input type="text" name="requerimiento[visibilidad][]" required={!this.state.SELECT_Visibility.disableInput} disabled={this.state.SELECT_Visibility.disableInput} />
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Detalles adicionales">
            <Row>
              <Field>
                <label>Restricciones</label>
                <textarea name="detallesAdicionales[restricciones]"></textarea>
              </Field>
              <Field>
                <label>Riesgos detectados</label>
                <textarea name="detallesAdicionales[riesgosDetectados]"></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Presupuesto asignado</label>
                <input id="YES_RADIO_Budget" className="radiobox-focus" name="detallesAdicionales[presupuestoAsignado][]" value="Sí" checked={this.state.YES_RADIO_Budget.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="YES_RADIO_Budget">Sí</label>
                <input id="NO_RADIO_Budget" className="radiobox-focus" name="detallesAdicionales[presupuestoAsignado][]"value="No" checked={this.state.NO_RADIO_Budget.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="NO_RADIO_Budget">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(this.state.NO_RADIO_Budget.checked, 'required')}>
                <label>Monto</label>
                <input type="number" className="currency" name="detallesAdicionales[presupuestoAsignado][]" required={true} min="0" step="0.01" disabled={this.state.NO_RADIO_Budget.checked}  required={this.state.YES_RADIO_Budget.checked}/>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere interacción con otras áreas o proyectos</label>
                <input id="YES_RADIO_Interaction" className="radiobox-focus" name="detallesAdicionales[requiereInteraccionConOtrasAreasOProyectos][]" value="Sí" checked={this.state.YES_RADIO_Interaction.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="YES_RADIO_Interaction">Sí</label>
                <input id="NO_RADIO_Interaction" className="radiobox-focus" name="detallesAdicionales[requiereInteraccionConOtrasAreasOProyectos][]" value="No" checked={this.state.NO_RADIO_Interaction.checked} onChange={this.handleCheckbox.bind(this)} type="radio"/>
                <label htmlFor="NO_RADIO_Interaction">No</label>
              </Field>
              <Field span={3} className={this.toggleDisabled(this.state.NO_RADIO_Interaction.checked, 'required')}>
                <label>Describir</label>
                <input type="text" name="detallesAdicionales[requiereInteraccionConOtrasAreasOProyectos][]" disabled={this.state.NO_RADIO_Interaction.checked} required={this.state.YES_RADIO_Interaction.checked}/>
              </Field>
            </Row>
          </Fieldset>
          <br />
          <br />
          <Fieldset legend="Material de soporte">
            <Row>
              <Field span={2}>
                <label>Diagrama</label>
                <DropzoneComponent config={this.dropzoneConfig} eventHandlers={this.dropzoneDiagramEventHandlers} djsConfig={this.dropzoneJSConfig} />
              </Field>
              <Field span={2}>
                <label>Documentos</label>
                <DropzoneComponent config={this.dropzoneConfig} eventHandlers={this.dropzoneDocsEventHandlers} djsConfig={this.dropzoneJSConfigMulti} />
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Links</label>
                <textarea name="materialDeSoporte[links]"></textarea>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere hardware</label>
                <input id="YES_RADIO_Hardware" className="radiobox-focus" name="materialDeSoporte[requiereHardware][]" value="Sí" checked={this.state.YES_RADIO_Hardware.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Hardware">Sí</label>
                <input id="NO_RADIO_Hardware" className="radiobox-focus" name="materialDeSoporte[requiereHardware][]" value="No" checked={this.state.NO_RADIO_Hardware.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
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
                <input id="YES_RADIO_Infrastructure" className="radiobox-focus" name="materialDeSoporte[requiereInfraestructura][]" value="Sí" checked={this.state.YES_RADIO_Infrastructure.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Infrastructure">Sí</label>
                <input id="NO_RADIO_Infrastructure" className="radiobox-focus" name="materialDeSoporte[requiereInfraestructura][]" value="No" checked={this.state.NO_RADIO_Infrastructure.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
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
                <input id="YES_RADIO_WebServices" className="radiobox-focus" name="materialDeSoporte[requiereWebServices][]" value="Sí" checked={this.state.YES_RADIO_WebServices.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_WebServices">Sí</label>
                <input id="NO_RADIO_WebServices" className="radiobox-focus" name="materialDeSoporte[requiereWebServices][]" value="No" checked={this.state.NO_RADIO_WebServices.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
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
                <input id="YES_RADIO_Design" className="radiobox-focus" name="materialDeSoporte[requiereDiseno][]" value="Sí" checked={this.state.YES_RADIO_Design.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Design">Sí</label>
                <input id="NO_RADIO_Design" className="radiobox-focus" name="materialDeSoporte[requiereDiseno][]" value="No" checked={this.state.NO_RADIO_Design.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
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
                <input id="YES_RADIO_Content" className="radiobox-focus" name="materialDeSoporte[requiereContenido][]" value="Sí" checked={this.state.YES_RADIO_Content.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Content">Sí</label>
                <input id="NO_RADIO_Content" className="radiobox-focus" name="materialDeSoporte[requiereContenido][]" value="No" checked={this.state.NO_RADIO_Content.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
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
                <input id="YES_RADIO_Installation" className="radiobox-focus" name="materialDeSoporte[requiereInstalacion][]" value="Sí" checked={this.state.YES_RADIO_Installation.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
                <label htmlFor="YES_RADIO_Installation">Sí</label>
                <input id="NO_RADIO_Installation" className="radiobox-focus" name="materialDeSoporte[requiereInstalacion][]" value="No" checked={this.state.NO_RADIO_Installation.checked} onChange={this.handleCheckbox.bind( this ) } type="radio"/>
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
            <ProgressButton onClick={this.handleSubmit.bind(this)} shouldAllowClickOnLoading={false}>
              Enviar
            </ProgressButton>
          </div>
        </div>
      </div>
    );
  }
}

export default FormComponent;