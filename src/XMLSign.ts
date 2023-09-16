const Dsig = require('facturacionelectronicapy-pkcs12');

class XMLSign {
  
  public async signWithNode(xmls: Array<any>, tag: any, file: any, password: any) {
    return new Promise(async (resolve, reject) => {
      try {
          var separator = '_SEPARATOR_';
          var dsig = new Dsig(file);
          dsig.openSession(password);

          let xmlFirmado = '';
          for (let i = 0; i < xmls.length; i++) {
            const xml = xmls[i];
            xmlFirmado += dsig.computeSignature(xmls[0], tag) + separator;
          }

          //Retira el ultimo _SEPARATOR_
          xmlFirmado = xmlFirmado.substring(0, xmlFirmado.length - separator.length);

          resolve(xmlFirmado);

      } catch(e) {
          console.error(e);
          reject(e);
      } finally {
          dsig.closeSession();
      }
    });
  }
}

export default new XMLSign();
