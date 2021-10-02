# pkcs12-xml

Esta librería se creó con el propósito de firmar documentos XML mediante el estándar DSIG con contenedores PKCS#12 desde aplicaciones escritas para nodejs.

## Instalación

```
$ npm install pkcs12-xml
```

## Ejemplo

### Firmar el tag "book" del documento xml

```javascript
const Dsig = require('pkcs12-xml');

var dsig = new Dsig('store.p12');

try {
    dsig.openSession('12345678');
    var xml = '<library><book><name>Julio Berne</name></book></library>';
    console.log(dsig.computeSignature(xml, 'book'));
} catch(e) {
    console.error(e);
} finally {
    dsig.closeSession();
}
```
