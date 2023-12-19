//const pkcs12 = require('facturacionelectronicapy-pkcs12');

class XMLDsigNode {
  
  public async signDocument(xmls: Array<any>, tag: any, file: any, password: any) {
    return new Promise(async (resolve, reject) => {
      var dsig = null;
      try {
          /*var separator = '_SEPARATOR_';
          var dsig = new pkcs12(file);
          dsig.openSession(password);

          let xmlFirmado = '';
          for (let i = 0; i < xmls.length; i++) {
            const xml = xmls[i];
            xmlFirmado += dsig.computeSignature(xmls[0], tag) + separator;
          }

          //Retira el ultimo _SEPARATOR_
          xmlFirmado = xmlFirmado.substring(0, xmlFirmado.length - separator.length);

          resolve(xmlFirmado);*/
          resolve("");

      } catch(e) {
          console.error(e);
          reject(e);
      } finally {
        if (dsig != null) {
          //dsig.closeSession();
        }
      }
    });
  }
}

export default new XMLDsigNode();
