//import convert from 'xml-js';
import xml2js from "xml2js";

//import sha256 from "crypto-js/sha256";
//import Base64 from "crypto-js/enc-base64";
import token from "./PKCS12";
import findJavaHome from "find-java-home";

//import crypto from 'crypto';
//const { subtle } = require('crypto').webcrypto;
const { exec } = require("child_process");
//var xmldom = require("xmldom");
var fs = require("fs");
//var c14n = require("xml-c14n")();

//var atob = require("atob");

//var xmldsigjs = require("xmldsigjs");
//var WebCrypto = require("node-webcrypto-ossl");
//xmldsigjs.Application.setEngine("OpenSSL", new WebCrypto());
//xmldsigjs.Application.setEngine("OpenSSL", new (await import("node-webcrypto-ossl")).Crypto)
//var SignedXml = require('xml-crypto').SignedXml;
//import { SignedXml, FileKeyInfo } from "xml-crypto";

class XMLDsig {
  private file: any;
  private passphase: any;
  //private signOpts: any;
  private signedInfo: any;
  private certificate: any;

  constructor() {}

  openFile(file: string, passphase: string) {
    this.file = file;
    this.passphase = passphase;
    token.openFile(file, passphase);
    this.setXMLSignOpts();
  }

  setXMLSignOpts() {
    /*this.signOpts = {
            compact: true,
            ignoreComment: true,
            spaces: 2,
            fullTagEmptyElement: true
        };*/
    this.signedInfo = {
      CanonicalizationMethod: {
        $: {
          Algorithm: "http://www.w3.org/2001/10/xml-exc-c14n#",
        },
      },
      SignatureMethod: {
        $: {
          Algorithm: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
        },
      },
      Reference: {
        $: {
          URI: "",
        },
        Transforms: {
          Transform: [
            {
              $: {
                Algorithm:
                  "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
              },
            },
            {
              $: {
                Algorithm: "http://www.w3.org/2001/10/xml-exc-c14n#",
              },
            },
          ],
        },
        DigestMethod: {
          $: {
            Algorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
          },
        },
        DigestValue: "",
      },
    };
  }

  /**
   * Firma con Java, retornando el documento firmado en el buffer de salida
   * @param xml
   * @param tag
   * @returns
   */
  async signDocument(xml: string, tag: any) {
    return new Promise(async (resolve, reject) => {
      //console.log("A firmar", xml);
      //xml = await this.asignarFechaFirma(xml);

      findJavaHome({ allowJre: true }, (err: any, java8Path: any) => {
        java8Path += "/bin/java";
        if (err) return console.log(err);

        //Comentar esta linea al llevar a Produccion, por que aqui trae java 6
        if (process.env.java8_home) {
          //java8Path = `"C:\\Program Files\\Java\\jdk1.8.0_221\\bin\\java"`;
          java8Path = `${process.env.java8_home}`;
        }

        const classPath = "" + __dirname + "";
        //const tmpXMLToSign = "" + __dirname + "/xml_sign_temp.xml";
        const tmpXMLToSign =
          "" +
          __dirname +
          "/xml_sign_temp_" +
          Math.round(Math.random() * 999999) +
          ".xml";

        fs.writeFileSync(tmpXMLToSign, xml, { encoding: "utf8" });

        exec(
          `"${java8Path}" -Dfile.encoding=IBM850 -classpath "${classPath}" SignXML "${tmpXMLToSign}" "${this.file}" "${this.passphase}" "${tag}"`,
          { encoding: "UTF-8" },
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              reject(error);
            }
            if (stderr) {
              reject(stderr);
            }

            try {
              fs.unlinkSync(tmpXMLToSign);
              //file removed
            } catch (err) {
              console.error(err);
            }

            //console.log(`signedXML: ${stdout}`);

            //resolve(Buffer.from(`${stdout}`,'utf8').toString());
            //fs.writeFileSync(tmpXMLToSign + ".result.xml", `${stdout}`, {encoding: 'utf8'});
            //let resultXML = fs.readFileSync(tmpXMLToSign + ".result.xml", {encoding: 'utf8'});
            resolve(`${stdout}`);
          }
        );
      });
    });
  }

  /**
   * Firma con Java, varios documentos al mismo tiempo
   * @param xml
   * @param tag
   * @returns
   */
  async signDocuments(xmls: Array<any>, tag: any) {
    return new Promise(async (resolve, reject) => {
      //console.log("A firmar", xml);

      findJavaHome({ allowJre: true }, (err: any, java8Path: any) => {
        java8Path += "/bin/java";
        if (err) return console.log(err);

        //Comentar esta linea al llevar a Produccion, por que aqui trae java 6
        if (process.env.java8_home) {
          //java8Path = `"C:\\Program Files\\Java\\jdk1.8.0_221\\bin\\java"`;
          java8Path = `${process.env.java8_home}`;
        }

        const classPath = "" + __dirname + "";
        //const tmpXMLToSign = "" + __dirname + "/xml_sign_temp.xml";
        const arrayNameFiles = new Array();

        for (let i = 0; i < xmls.length; i++) {
          const xml = xmls[i];

          const tmpXMLToSign =
            "" +
            __dirname +
            "/xml_sign_temp_" +
            Math.round(Math.random() * 999999) +
            ".xml";

          fs.writeFileSync(tmpXMLToSign, xml, { encoding: "utf8" });

          arrayNameFiles.push(tmpXMLToSign);
        }

        exec(
          `"${java8Path}" -Dfile.encoding=IBM850 -classpath "${classPath}" SignXMLFiles "${arrayNameFiles.join(
            ","
          )}" "${this.file}" "${this.passphase}" "${tag}"`,
          { encoding: "UTF-8" },
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              reject(error);
            }
            if (stderr) {
              reject(stderr);
            }

            try {
              for (let i = 0; i < arrayNameFiles.length; i++) {
                const nameFile = arrayNameFiles[i];
                fs.unlinkSync(nameFile);
              }
              //file removed
            } catch (err) {
              console.error(err);
            }

            //console.log(`signedXML: ${stdout}`);

            //resolve(Buffer.from(`${stdout}`,'utf8').toString());
            //fs.writeFileSync(tmpXMLToSign + ".result.xml", `${stdout}`, {encoding: 'utf8'});
            //let resultXML = fs.readFileSync(tmpXMLToSign + ".result.xml", {encoding: 'utf8'});
            resolve(`${stdout}`);
          }
        );
      });
    });
  }

  /**
   * Firma el XML del Evento con Java
   * @param xml
   * @param tag
   * @returns
   */
  async signEvento(xml: string, tag: any) {
    return new Promise(async (resolve, reject) => {
      //console.log("A firmar", xml);
      //xml = await this.asignarFechaFirma(xml);

      findJavaHome({ allowJre: true }, (err: any, java8Path: any) => {
        java8Path += "/bin/java";
        if (err) return console.log(err);

        //Comentar esta linea al llevar a Produccion, por que aqui trae java 6
        if (process.env.java8_home) {
          //java8Path = `"C:\\Program Files\\Java\\jdk1.8.0_221\\bin\\java"`;
          java8Path = `${process.env.java8_home}`;
        }

        const classPath = "" + __dirname + "";
        const tmpXMLToSign = "" + __dirname + "/xml_sign_temp.xml";

        fs.writeFileSync(tmpXMLToSign, xml, { encoding: "utf8" });

        exec(
          `"${java8Path}" -Dfile.encoding=IBM850 -classpath "${classPath}" SignXMLEvento "${tmpXMLToSign}" "${this.file}" "${this.passphase}"`,
          { encoding: "UTF-8" },
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              reject(error);
            }
            if (stderr) {
              reject(stderr);
            }

            try {
              fs.unlinkSync(tmpXMLToSign);
              //file removed
            } catch (err) {
              console.error(err);
            }

            //console.log(`signedXML: ${stdout}`);

            //resolve(Buffer.from(`${stdout}`,'utf8').toString());
            //fs.writeFileSync(tmpXMLToSign + ".result.xml", `${stdout}`, {encoding: 'utf8'});
            //let resultXML = fs.readFileSync(tmpXMLToSign + ".result.xml", {encoding: 'utf8'});
            resolve(`${stdout}`);
          }
        );
      });
    });
  }

  /*async signDocument2(xml: string, tag: any) {
    xmldsigjs.Application.setEngine(
      "OpenSSL",
      new (await import("node-webcrypto-ossl")).Crypto()
    );

    let id = "";
    var parser = new xml2js.Parser({ explicitArray: false });
    const xmlDocumentJSON: any = await parser.parseStringPromise(xml);

    if (tag) {
      if (!xmlDocumentJSON["rDE"][tag]) {
        throw new Error("Tag " + tag + " no encontrado en el Archivo XML");
      }
      const idTag: any = xmlDocumentJSON["rDE"][tag].$.Id;
      id = `${idTag}`;
    }

    let key = Buffer.from(token.getPrivateKey() + "", "utf8");
    let cert = Buffer.from(token.getCertificate() + "", "utf8");

    let keysS = await this.importKey(token.getPrivateKey() + "");

    let signature = new xmldsigjs.SignedXml();

    signature
      .Sign({ name: "RSASSA-PKCS1-v1_5" }, keysS, xmldsigjs.Parse(xml), {
        references: [
          { id, hash: "SHA-512", transforms: ["enveloped", "c14n"] },
        ],
      })
      .then(() => {
        console.log("sig.tostring...", signature.toString());
      });
  }*/

  /*async signDocument3(xml: string, tag: any) {
    //var option = {implicitTransforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"]}
    var option = {
      implicitTransforms: ["http://www.w3.org/2001/10/xml-exc-c14n#"],
    };
    var sig = new SignedXml(null, option);
    sig.signatureAlgorithm =
      "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    //sig.signatureAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
    //sig.signatureAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";

    //sig.canonicalizationAlgorithm = "http://www.w3.org/2000/09/xmldsig#enveloped-signature";
    sig.addReference(
      "//*[local-name(.)='DE']",
      [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "http://www.w3.org/2001/10/xml-exc-c14n#",
      ],
      "http://www.w3.org/2001/04/xmlenc#sha256"
    );
    //sig.addReference("//*[local-name(.)='DE']");
    sig.signingKey = Buffer.from(token.getPrivateKey() + "", "utf8");

    sig.keyInfoProvider = {
      file: "",
      getKeyInfo: (key, prefix) => {
        return `<X509Data><X509Certificate>${token.getCertificate()}</X509Certificate></X509Data>`;
      },
      getKey: (keyInfo: Node): Buffer => {
        return Buffer.from(token.getPrivateKey() + "");
      },
    };
    sig.computeSignature(xml);

    let xmlSigned = sig.getSignedXml();

    token.clean();

    return xmlSigned;
  }*/

  /*async signDocument_El_que_que_funcionar(xml: string, tag: any) {
    var parser = new xml2js.Parser({ explicitArray: false });
    const xmlDocumentJSON: any = await parser.parseStringPromise(xml);

    const $: any = {
      xmlns: "http://www.w3.org/2000/09/xmldsig#",
    };
    if (tag) {
      if (!xmlDocumentJSON["rDE"][tag]) {
        throw new Error("Tag " + tag + " no encontrado en el Archivo XML");
      }
      const idTag: any = xmlDocumentJSON["rDE"][tag].$.Id;
      this.signedInfo.Reference.$.URI = `#${idTag}`;
    }

    let objetoAFirmar = { ...xmlDocumentJSON["rDE"] };
    delete objetoAFirmar.$;
    delete objetoAFirmar.dVerFor;

    var builder = new xml2js.Builder();
    let xmlToDigest = builder.buildObject(objetoAFirmar);

    //console.log("xmlToDigest a", xmlToDigest);
    xmlToDigest = await this.normalizeXML(xmlToDigest);
    xmlToDigest = xmlToDigest.replace(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      ""
    );
    //xmlToDigest = await this.canonicalizar(xmlToDigest);
    //Prueba

    //xmlToDigest = xmlToDigest.replace('<DE Id="01800695631001001000000122020101411987164320">', '');
    //xmlToDigest = xmlToDigest.replace('</DE>', '');
    //xmlToDigest = xmlToDigest.split('\n').slice(1).join('\n');

    const hash = this.digest(xmlToDigest);

    this.signedInfo.Reference.DigestValue = hash;

    var signedInfoXML = builder.buildObject({
      SignedInfo: {
        $,
        CanonicalizationMethod: this.signedInfo.CanonicalizationMethod,
        SignatureMethod: this.signedInfo.SignatureMethod,
        Reference: this.signedInfo.Reference,
      },
    });
    //signedInfoXML = signedInfoXML.split('\n').slice(1).join('\n');
    xmlToDigest = await this.canonicalizar(signedInfoXML);

    let signature = this.signatureValue(signedInfoXML);

    xmlDocumentJSON["rDE"].Signature = {
      $: {
        xmlns: "http://www.w3.org/2000/09/xmldsig#",
      },
      SignedInfo: this.signedInfo,
      SignatureValue: signature,
      KeyInfo: {
        X509Data: {
          X509Certificate: this.certificate.split("\r").join(""),
        },
      },
    };
    xmlDocumentJSON["rDE"]["gCamFuFD"] = this.agregarQr(xmlDocumentJSON);

    var xmlSigned = builder.buildObject(xmlDocumentJSON);
    //xmlSigned = await this.normalizeXML(xmlSigned);
    token.clean();

    return xmlSigned;
  }*/

  /*
  canonicalizar(xml: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let document = new xmldom.DOMParser().parseFromString(xml);

      let canonicaliser = c14n.createCanonicaliser(
        "http://www.w3.org/2001/10/xml-exc-c14n#"
      );

      canonicaliser.canonicalise(
        document.documentElement,
        function (err: any, res: any) {
          if (err) {
            reject(err);
          }

          resolve(res);
        }
      );
    });
  }*/
  /*digest(xml: string) {
        var sha256 = crypto.createHash('sha256');

        sha256.update(xml, 'utf8');
        return sha256.digest('base64');
    }*/

  /* no usado
  digest(xml: string) {
    const hashDigest = sha256(xml);
    const hmacDigest = Base64.stringify(hashDigest);
    return hmacDigest;
  }*/

  signatureValue(xml: string) {
    let privateKey = token.getPrivateKey();
    this.certificate = token.getCertificate();
    let signature = token.signature(xml, privateKey);
    //console.log("signature", signature);
    return Buffer.from(signature, "binary").toString("base64");
  }

  getCertificate() {
    let certificate = token.getCertificate();
    return `-----BEGIN CERTIFICATE-----${certificate}\n-----END CERTIFICATE-----`;
  }

  private normalizeXML(xml: string) {
    xml = xml.split("\r\n").join("");
    xml = xml.split("\n").join("");
    xml = xml.split("\t").join("");
    xml = xml.split("    ").join("");
    xml = xml.split(">    <").join("><");
    xml = xml.split(">  <").join("><");
    xml = xml.replace(/\r?\n|\r/g, "");
    return xml;
  }

  private agregarQr(obj: any) {
    let qrResult: any = {};
    qrResult["dCarQR"] = {
      _: "reemplazarQrCode",
    };
    return qrResult;
  }

  removeLines(str: string) {
    return str.replace("\n", "");
  }

  base64ToArrayBuffer(b64: string) {
    var byteString = atob(b64);
    var byteArray = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }

    return byteArray;
  }

  pemToArrayBuffer(pem: string) {
    var b64Lines = this.removeLines(pem);
    b64Lines = b64Lines.replace("-----BEGIN PRIVATE KEY-----", "");
    b64Lines = b64Lines.replace("-----END PRIVATE KEY-----", "");
    b64Lines = b64Lines.replace("-----BEGIN RSA PRIVATE KEY-----", "");
    b64Lines = b64Lines.replace("-----END RSA PRIVATE KEY-----", "");

    return this.base64ToArrayBuffer(b64Lines);
  }

  /*  async importKey(yourprivatekey: string) {
    let crypto = new (await import("node-webcrypto-ossl")).Crypto();
    //window.crypto.subtle.importKey(
    return crypto.subtle.importKey(
      "pkcs8",
      this.pemToArrayBuffer(yourprivatekey),
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" }, // or SHA-512
      },
      true,
      ["decrypt"]
    );
  }*/

  private async asignarFechaFirma(xml: string) {
    var parser = new xml2js.Parser({ explicitArray: false });
    const xmlDocumentJSON: any = await parser.parseStringPromise(xml);

    xmlDocumentJSON["rDE"]["DE"]["dFecFirma"] = this.jsonFormat(new Date());

    var builder = new xml2js.Builder();
    xml = builder.buildObject(xmlDocumentJSON);

    xml = this.normalizeXML(xml);
    return xml;
  }
  private jsonFormat(fecha: Date) {
    return (
      fecha.getFullYear() +
      "-" +
      this.lpad(fecha.getMonth() + 1, 2) +
      "-" +
      this.lpad(fecha.getDate(), 2) +
      "T" +
      this.lpad(fecha.getHours(), 2) +
      ":" +
      this.lpad(fecha.getMinutes(), 2) +
      ":" +
      this.lpad(fecha.getSeconds(), 2)
    );
  }

  private lpad(num: number, size: number) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
}

export default new XMLDsig();
