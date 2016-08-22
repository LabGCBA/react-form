/*jshint esnext: true */

import React, { Component } from 'react';

import Menu from 'components/Menu/Menu';

class ListItemComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="grid-form" id={this.props.element.key}>
        <fieldset>
          <legend>Proyecto</legend>
          <div data-row-span="3">
              <div data-field-span="1">
                <label>Tipo</label>
                <span>{this.props.element.item.proyecto.tipo}</span>
              </div>
              <div data-field-span="2" >
                  <label>Nombre</label>
                  <span>{this.props.element.item.proyecto.nombre}</span>
              </div>
          </div>
          <div data-row-span="4">
              <div data-field-span="3">
                <label>Área Solicitante</label>
                <span>{this.props.element.item.proyecto.areaSolicitante}</span>
              </div>
              <div data-field-span="1">
                  <label>Forma de contacto preferida</label>
                  <span>{this.props.element.item.proyecto.formaDeContactoPreferida}</span>
              </div>
          </div>
        </fieldset>
        <br/>
        <fieldset>
          <legend>Contacto</legend>
          <div data-row-span="3">
              <div data-field-span="2">
                  <label>Nombre y Apellido</label>
                  <span>{this.props.element.item.contacto.nombreYApellido}</span>
              </div>
              <div data-field-span="1">
                  <label>Cargo</label>
                  <span>{this.props.element.item.contacto.cargo}</span>
              </div>
          </div>
          <div data-row-span="5">
              <div data-field-span="2">
                  <label>Teléfono</label>
                  <span>{this.props.element.item.contacto.telefono}</span>
                </div>
              <div data-field-span="1">
                  <label>Interno</label>
                  <span>{this.props.element.item.contacto.interno}</span>
                </div>
              <div data-field-span="2">
                  <label>Email</label>
                  <span>{this.props.element.item.contacto.email}</span>
              </div>
          </div>
          <div data-row-span="4">
              <div data-field-span="3">
                  <label>Dirección</label>
                  <span>{this.props.element.item.contacto.direccion}</span>
              </div>
              <div data-field-span="1">
                  <label>Compromiso en horas</label>
                  <span>{this.props.element.item.contacto.compromisoEnHoras}</span>
              </div>
          </div>
      </fieldset>
      <br/>
      <fieldset>
          <legend>Requerimiento</legend>
          <div data-row-span="2">
              <div data-field-span="1">
                  <label>Tipo</label>
                  <span>{this.props.element.item.requerimiento.tipo}</span>
              </div>
              <div data-field-span="1">
                  <label>Importancia</label>
                  <span>{this.props.element.item.requerimiento.importancia}</span>
              </div>
          </div>
          <div data-row-span="1">
              <div data-field-span="1">
                  <label>Descripción</label>
                  <span>{this.props.element.item.requerimiento.descripcion}</span>
              </div>
          </div>
          <div data-row-span="1">
              <div data-field-span="1">
                  <label>Especificación de funciones</label>
                  <span>{this.props.element.item.requerimiento.especificacionDeFunciones}</span>
              </div>
          </div>
          <div data-row-span="3">
              <div data-field-span="1">
                  <label>Visibilidad</label>
                  <span>{this.props.element.item.requerimiento.visibilidad[0]}</span>
              </div>
              <div data-field-span="2">
                  <label>Otro</label>
                  <span>{this.props.element.item.requerimiento.visibilidad[1]}</span>
              </div>
          </div>
      </fieldset>
      <br/>
      <fieldset>
        <legend>Detalles adicionales</legend>
        <div data-row-span="2">
            <div data-field-span="1">
                <label>Restricciones</label>
                <span>{this.props.element.item.detallesAdicionales.restricciones}</span>
            </div>
            <div data-field-span="1">
                <label>Riesgos detectados</label>
                <span>{this.props.element.item.detallesAdicionales.riesgosDetectados}</span>
            </div>
        </div>
        <div data-row-span="4">
            <div data-field-span="1">
                <label>Presupuesto asignado</label>
                <span>{this.props.element.item.detallesAdicionales.presupuestoAsignado[0]}</span>
            </div>
            <div data-field-span="3">
                <label>Monto</label>
                <span>{this.props.element.item.detallesAdicionales.presupuestoAsignado[1]}</span>
            </div>
        </div>
        <div data-row-span="4">
            <div data-field-span="1">
                <label>Requiere interacción con otras áreas o proyectos</label>
                <span>{this.props.element.item.detallesAdicionales.requiereInteraccionConOtrasAreasOProyectos[0]}</span>
            </div>
            <div data-field-span="3">
                <label>Describir</label>
                <span>{this.props.element.item.detallesAdicionales.requiereInteraccionConOtrasAreasOProyectos[1]}</span>
            </div>
        </div>
      </fieldset>
      <br/>
      <fieldset>
        <legend>Material de soporte</legend>
        <div data-row-span="1">
            <div data-field-span="1">
                <label>Diagrama</label>
                <span>{this.props.element.item.materialDeSoporte.diagrama}</span>
            </div>
        </div>
        <div data-row-span="2">
            <div data-field-span="1">
                <label>Documentos</label>
                <span>{Array.isArray(this.props.element.item.materialDeSoporte.documentos) ? this.props.element.item.materialDeSoporte.documentos.join('\n') : ''}</span>
            </div>
            <div data-field-span="1">
                <label>Links</label>
                <span>{Array.isArray(this.props.element.item.materialDeSoporte.links) ? this.props.element.item.materialDeSoporte.links.join('\n') : ''}</span>
            </div>
        </div>
        <div data-row-span="4">
            <div data-field-span="1">
                <label>Requiere hardware</label>
                <span>{this.props.element.item.materialDeSoporte.requiereHardware[0]}</span>
            </div>
            <div data-field-span="1">
                <label>Detalle</label>
                <span>{this.props.element.item.materialDeSoporte.requiereHardware[1]}</span>
            </div>
            <div data-field-span="1">
                <label>Requiere infraestructura</label>
                <span>{this.props.element.item.materialDeSoporte.requiereInfraestructura[0]}</span>
            </div>
            <div data-field-span="1">
                <label>Detalle</label>
                <span>{this.props.element.item.materialDeSoporte.requiereInfraestructura[1]}</span>
            </div>
        </div>
        <div data-row-span="4">
            <div data-field-span="1">
                <label>Requiere webservices</label>
                <span>{this.props.element.item.materialDeSoporte.requiereWebServices[0]}</span>
            </div>
            <div data-field-span="1">
                <label>Detalle</label>
                <span>{this.props.element.item.materialDeSoporte.requiereWebServices[1]}</span>
            </div>
            <div data-field-span="1">
                <label>Requiere diseño</label>
                <span>{this.props.element.item.materialDeSoporte.requiereDiseno[0]}</span>
            </div>
            <div data-field-span="1">
                <label>Detalle</label>
                <span>{this.props.element.item.materialDeSoporte.requiereDiseno[1]}</span>
            </div>
        </div>
        <div data-row-span="4">
            <div data-field-span="1">
                <label>Requiere contenido</label>
                <span>{this.props.element.item.materialDeSoporte.requiereContenido[0]}</span>
            </div>
            <div data-field-span="1">
                <label>Detalle</label>
                <span>{this.props.element.item.materialDeSoporte.requiereDiseno[1]}</span>
            </div>
            <div data-field-span="1">
                <label>Requiere instalación</label>
                <span>{this.props.element.item.materialDeSoporte.requiereInstalacion[0]}</span>
            </div>
            <div data-field-span="1">
                <label>Detalle</label>
                <span>{this.props.element.item.materialDeSoporte.requiereInstalacion[1]}</span>
            </div>
        </div>
      </fieldset>
    </div>
    );
  }
}

export default ListItemComponent;