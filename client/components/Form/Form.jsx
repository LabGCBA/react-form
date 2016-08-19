import React, { Component } from 'react';
import { GridForm, Fieldset, Row, Field } from 'react-gridforms';

class FormComponent extends Component {
  render() {
    return (
      <div>
        <GridForm>
          <Fieldset legend="Proyecto">
            <Row>
              <Field>
                <label>Tipo</label>
                <input id="new-project" name="proyecto-nuevo" type="radio"/><label htmlFor="new-project">Proyecto Nuevo</label>
                <input id="existing-project" name="proyecto-nuevo" type="radio"/><label htmlFor="existing-project">Proyecto Existente</label>
              </Field>
              <Field span={2}>
                <label>Nombre</label>
                <input type="text"/>
              </Field>
            </Row>
            <Row>
              <Field span={3}>
                <label>Area Solicitante</label>
                <input type="text"/>
              </Field>
              <Field>
                <label>Forma de contacto preferida</label>
                <select>
                  <option value="Telefono" title="Telefono">Telefono</option>
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
                <select>
                  <option value="Ciudadanos" title="Ciudadanos">Ciudadanos</option>
                  <option value="Gobierno" title="Gobierno">Gobierno</option>
                  <option value="Ministerio" title="Ministerio">Ministerio</option>
                  <option value="Direccion" title="Dirección">Dirección</option>
                  <option value="Gerencia" title="Gerencia">Gerencia</option>
                  <option value="Area" title="Área">Área</option>
                  <option value="Otro" title="Otro">Otro</option>
                </select>
              </Field>
              <Field span={2}>
                <label>Otro</label>
                <input type="text"/>
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
                <input id="yes-budget" name="presupuesto-asignado" type="radio"/><label htmlFor="yes-budget">Sí</label>
                <input id="no-budget" name="presupuesto-asignado" type="radio"/><label htmlFor="no-budget">No</label>
              </Field>
              <Field span={3}>
                <label>Monto</label>
                <input type="text"/>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere interacción con otras áreas o proyectos</label>
                <input id="yes-interaction" name="requiere-interaccion" type="radio"/><label htmlFor="yes-interaction">Sí</label>
                <input id="no-interaction" name="requiere-interaccion" type="radio"/><label htmlFor="no-interaction">No</label>
              </Field>
              <Field span={3}>
                <label>Describir</label>
                <input type="text"/>
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
                <input id="yes-hardware" name="provee-o-necesita-hardware" type="radio"/><label htmlFor="yes-hardware">Sí</label>
                <input id="no-hardware" name="provee-o-necesita-hardware" type="radio"/><label htmlFor="no-hardware">No</label>
              </Field>
              <Field>
                <label>Detalle</label>
                <select>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere infraestructura</label>
                <input id="yes-infrastructure" name="provee-o-necesita-infraestructura" type="radio"/><label htmlFor="yes-infrastructure">Sí</label>
                <input id="no-infrastructure" name="provee-o-necesita-infraestructura" type="radio"/><label htmlFor="no-infrastructure">No</label>
              </Field>
              <Field>
                <label>Detalle</label>
                <select>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere webservices</label>
                <input id="yes-webservices" name="provee-o-necesita-webservices" type="radio"/><label htmlFor="yes-webservices">Sí</label>
                <input id="no-webservices" name="provee-o-necesita-webservices" type="radio"/><label htmlFor="no-webservices">No</label>
              </Field>
              <Field>
                <label>Detalle</label>
                <select>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere diseño</label>
                <input id="yes-design" name="provee-o-necesita-diseno" type="radio"/><label htmlFor="yes-design">Sí</label>
                <input id="no-design" name="provee-o-necesita-diseno" type="radio"/><label htmlFor="no-design">No</label>
              </Field>
              <Field>
                <label>Detalle</label>
                <select>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>Requiere contenido</label>
                <input id="yes-content" name="provee-o-necesita-contenido" type="radio"/><label htmlFor="yes-content">Sí</label>
                <input id="no-content" name="provee-o-necesita-contenido" type="radio"/><label htmlFor="no-content">No</label>
              </Field>
              <Field>
                <label>Detalle</label>
                <select>
                  <option value="Provee" title="Provee">Provee</option>
                  <option value="Necesita" title="Necesita">Necesita</option>
                </select>
              </Field>
              <Field>
                <label>Requiere instalación</label>
                <input id="yes-installation" name="provee-o-necesita-instalacion" type="radio"/><label htmlFor="yes-installation">Sí</label>
                <input id="no-installation" name="provee-o-necesita-instalacion" type="radio"/><label htmlFor="no-installation">No</label>
              </Field>
              <Field>
                <label>Detalle</label>
                <select>
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
