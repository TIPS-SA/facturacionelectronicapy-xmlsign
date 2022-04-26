# Facturación Electrónica - Firma de XML para la SET (Paraguay)
Este módulo NodeJS firma la factura electrónica en formato XML para enviar a la SET mediante el estándar DSIG utilizando certificados del tipo PKCS#12

## Características
- Estampa de tiempo de la firma digital automática.

## Instalación

```
$ npm install facturacionelectronicapy-xmlsign
```

## Firma del Archivo XML

### Firmar los datos de la tag "DE" del documento xml

TypeScript:
```typescript
import xmlsign from 'facturacionelectronicapy-xmlsign';

xmlsign
.signXML(xmlString, '/full_path/Certificado.p12', '123456')
.then(xmlFirmado => console.log("XML firmado", xmlFirmado));

```

Para saber como generar el Archivo XML visita éste proyecto de Git visitar: 
https://github.com/marcosjara/facturacionelectronicapy-xmlgen


## Todos los proyectos
[Generación de XML](https://www.npmjs.com/package/facturacionelectronicapy-xmlgen)<br/>
[Firma de XML](https://www.npmjs.com/package/facturacionelectronicapy-xmlsign)<br/>
[Generación de QR](https://www.npmjs.com/package/facturacionelectronicapy-qrgen)<br/>
[API de la SET](https://www.npmjs.com/package/facturacionelectronicapy-setapi)<br/>
[Generación KUDE](https://www.npmjs.com/package/facturacionelectronicapy-kude)<br/>


## Empresas que utilizan éstos proyectos
[JHF Ingeniería Informática](https://jhf.com.py/)<br/>
[JR Ingeniería y Servicios](https://jringenieriayservicios.com/)<br/>
[FacturaSend](https://www.facturasend.com/)<br/>

