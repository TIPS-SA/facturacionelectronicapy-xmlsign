//const pkcs12 = require('facturacionelectronicapy-pkcs12');
const fs = require("fs");
const { SignedXml, FileKeyInfo } = require("xml-crypto");
const xmlbuilder = require("xmlbuilder");
const xml2js = require("xml2js");

import forge from "node-forge";

class XMLDsigNode {
  private p12Asn1: any;
  private p12: any;

  public async signDocuments(
    xmls: Array<any>,
    tag: any,
    file: any,
    password: any
  ) {
    return new Promise(async (resolve, reject) => {
      var dsig = null;
      try {
        var separator = "_SEPARATOR_";
        this.openFile(file, password);

        let certificate: any = this.getCertificate();

        // Crear un objeto SignedXml

        // Configurar la clave privada para firmar (ejemplo, deberías cargar tu propia clave privada)

        let xmlFirmado = "";
        for (let i = 0; i < xmls.length; i++) {
          const xmlString = xmls[i];

          const sig = new SignedXml({
            publicKey: this.getCertificate(),
            privateKey: this.getPrivateKey(),
            passphrase: password,
            getKeyInfoContent: (publicKey: any, prefix: any) => {
              const certContent = certificate.replace(/(?:\r\n|\r|\n)/g, ""); // Remover saltos de línea del certificado
              return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
            },
          });

          const jsonXML = await xml2js.parseStringPromise(xmlString);
          const idAtributo = jsonXML.rDE[tag][0].$.Id;

          sig.addReference(
            /*"#" + idAtributo, */ {
              xpath: "//*[local-name()='" + tag + "']",
              digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
              transforms: [
                "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
                "http://www.w3.org/2001/10/xml-exc-c14n#",
              ],
            }
          );
          sig.signatureAlgorithm =
            "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"; // Algoritmo de firma RSA con SHA-256
          sig.canonicalizationAlgorithm =
            "http://www.w3.org/2001/10/xml-exc-c14n#";

          // Calcular la firma
          sig.computeSignature(xmlString);

          // Obtener la firma en formato XML
          const xmlWithSignature = sig.getSignedXml();

          xmlFirmado += xmlWithSignature + separator;
        }

        //Retira el ultimo _SEPARATOR_
        xmlFirmado = xmlFirmado.substring(
          0,
          xmlFirmado.length - separator.length
        );

        resolve(xmlFirmado);
      } catch (e) {
        console.error(e);
        reject(e);
      } finally {
        if (dsig != null) {
          //dsig.closeSession();
        }
      }
    });
  }

  public async signDocument(
    xmlString: any,
    tag: any,
    file: any,
    password: any
  ) {
    return new Promise(async (resolve, reject) => {
      var dsig = null;
      try {
        this.openFile(file, password);

        let certificate: any = this.getCertificate();

        // Crear un objeto SignedXml

        // Configurar la clave privada para firmar (ejemplo, deberías cargar tu propia clave privada)

        let xmlFirmado = "";

        const sig = new SignedXml({
          publicKey: this.getCertificate(),
          privateKey: this.getPrivateKey(),
          passphrase: password,
          getKeyInfoContent: (publicKey: any, prefix: any) => {
            const certContent = certificate.replace(/(?:\r\n|\r|\n)/g, ""); // Remover saltos de línea del certificado
            return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
          },
        });

        const jsonXML = await xml2js.parseStringPromise(xmlString);
        const idAtributo = jsonXML.rDE[tag][0].$.Id;

        sig.addReference(
          /*"#" + idAtributo, */ {
            xpath: "//*[local-name()='" + tag + "']",
            digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
            transforms: [
              "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
              "http://www.w3.org/2001/10/xml-exc-c14n#",
            ],
          }
        );
        sig.signatureAlgorithm =
          "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"; // Algoritmo de firma RSA con SHA-256
        sig.canonicalizationAlgorithm =
          "http://www.w3.org/2001/10/xml-exc-c14n#";

        // Calcular la firma
        sig.computeSignature(xmlString);

        // Obtener la firma en formato XML
        const xmlWithSignature = sig.getSignedXml();

        xmlFirmado += xmlWithSignature;

        resolve(xmlFirmado);
      } catch (e) {
        console.error(e);
        reject(e);
      } finally {
        if (dsig != null) {
          //dsig.closeSession();
        }
      }
    });
  }

  public async signEvento(xmlString: any, tag: any, file: any, password: any) {
    return new Promise(async (resolve, reject) => {
      var dsig = null;
      try {
        //var separator = "_SEPARATOR_";
        this.openFile(file, password);

        let certificate: any = this.getCertificate();

        // Crear un objeto SignedXml

        // Configurar la clave privada para firmar (ejemplo, deberías cargar tu propia clave privada)

        let xmlFirmado = "";

        const sig = new SignedXml({
          publicKey: this.getCertificate(),
          privateKey: this.getPrivateKey(),
          passphrase: password,
          getKeyInfoContent: (publicKey: any, prefix: any) => {
            const certContent = certificate.replace(/(?:\r\n|\r|\n)/g, ""); // Remover saltos de línea del certificado
            return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
          },
        });

        const jsonXML = await xml2js.parseStringPromise(xmlString);
        const idAtributo =
          jsonXML["env:Envelope"]["env:Body"][0]["rEnviEventoDe"][0][
            "dEvReg"
          ][0]["gGroupGesEve"][0]["rGesEve"][0][tag][0].$.Id;

        sig.addReference(
          /*"#" + idAtributo, */ {
            xpath: "//*[local-name()='" + tag + "']",
            digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
            transforms: [
              "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
              "http://www.w3.org/2001/10/xml-exc-c14n#",
            ],
          }
        );
        sig.signatureAlgorithm =
          "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"; // Algoritmo de firma RSA con SHA-256
        sig.canonicalizationAlgorithm =
          "http://www.w3.org/2001/10/xml-exc-c14n#";

        // Calcular la firma
        sig.computeSignature(xmlString, {
          location: {
            reference: "//*[local-name()='" + tag + "']",
            action: "after",
          },
        });

        // Obtener la firma en formato XML
        const xmlWithSignature = sig.getSignedXml();

        xmlFirmado += xmlWithSignature;

        resolve(xmlFirmado);
      } catch (e) {
        console.error(e);
        reject(e);
      } finally {
        if (dsig != null) {
          //dsig.closeSession();
        }
      }
    });
  }

  openCertificate(file: string) {
    if (fs.existsSync(file)) {
      const pkcs12 = fs.readFileSync(file);
      this.p12Asn1 = forge.asn1.fromDer(pkcs12.toString("binary"));
    } else {
      throw Error(file + " no encontrado!");
    }
  }

  openFile(file: string, passphase: string) {
    this.openCertificate(file);

    this.p12 = forge.pkcs12.pkcs12FromAsn1(this.p12Asn1, false, passphase);
  }

  cleanCertificate() {
    this.p12 = undefined;
  }

  getCertificate() {
    for (let i = 0; i < this.p12.safeContents.length; i++) {
      if (this.p12.safeContents[i].safeBags[0].cert) {
        const b64 = forge.pki.certificateToPem(
          this.p12.safeContents[i].safeBags[0].cert
        );
        const l = b64.split("\n");
        l.pop();
        l.pop();
        l[0] = "";
        return l.join("\n");
      }
    }
    return null;
  }

  getPrivateKey() {
    for (let i = 0; i < this.p12.safeContents.length; i++) {
      if (this.p12.safeContents[i].safeBags[0].key) {
        return forge.pki.privateKeyToPem(
          this.p12.safeContents[i].safeBags[0].key
        );
      }
    }
    return null;
  }

  public async getExpiration(file: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const p12File = fs.readFileSync(file);
        const p12Asn1 = forge.asn1.fromDer(
          forge.util.createBuffer(p12File.toString("binary"))
        );

        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password); // Cambia 'your-password' por la contraseña de tu archivo .p12

        const certBag1: any = p12.getBags({ bagType: forge.pki.oids.certBag });
        const certBag = certBag1[forge.pki.oids.certBag][0];
        const certificate = certBag.cert;

        resolve(certificate.validity);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new XMLDsigNode();
