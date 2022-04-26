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
