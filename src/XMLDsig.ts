import convert from 'xml-js';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import token from './PKCS12';

class XMLDsig {

    private signOpts: any;
    private signedInfo: any;
    private certificate: any;

    constructor() {
    }

    openFile(file: string, passphase: string) {
        token.openFile(file, passphase);
        this.setXMLSignOpts();
    }

    setXMLSignOpts() {
        this.signOpts = {
            compact: true,
            ignoreComment: true,
            spaces: 2,
            fullTagEmptyElement: true
        };
        this.signedInfo = {
            CanonicalizationMethod: {
                _attributes: {
                    Algorithm: 'http://www.w3.org/2001/10/xml-exc-c14n#'
                }
            },
            SignatureMethod: {
                _attributes: {
                    Algorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256'
                }
            },
            Reference: {
                _attributes: {
                    URI: ''
                },
                Transforms: {
                    Transform: [
                        {
                            _attributes: {
                                Algorithm: 'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
                            }
                        }, {
                            _attributes: {
                                Algorithm: 'http://www.w3.org/2001/10/xml-exc-c14n#'
                            }
                        }
                    ]
                },
                DigestMethod: {
                    _attributes: {
                        Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256'
                    }
                },
                DigestValue: ''
            }
        };
    }

    signDocument(xml: string, tag: any) {
        
        const doc: any = convert.xml2js(xml, this.signOpts);
        const root: any = Object.keys(doc).filter(key => key !== '_declaration');

        if (root.length !== 1) {
            throw new Error('Debe ser un Archivo XML');
        }
        const _attributes : any = {
            xmlns: 'http://www.w3.org/2000/09/xmldsig#'
        };
        if (tag) {
            if (!doc[root[0]][tag]) {
//                doc[root[0]][tag]._attributes = { id: tag };
//            } else {
                throw new Error('Tag ' + tag + ' no encontrado en el Archivo XML');
            }
            //console.log("===>", doc[root[0]][tag]);
            const idTag:any = doc[root[0]][tag]._attributes.Id;
            this.signedInfo.Reference._attributes.URI = `#${idTag}`;
        }
        
        if (doc[root[0]]._attributes) {
            const attributes = Object.keys(doc[root[0]]._attributes);
            for (let i = 0; i < attributes.length; i++) {
                const attribute : string = attributes[i];
                if (attribute.startsWith('xmlns:')) {
                    _attributes[attribute] = doc[root[0]]._attributes[attribute];
                }
            }
        }
        
        const hash = this.digest(convert.js2xml({ [root[0]]: doc[root[0]] }, this.signOpts));

        this.signedInfo.Reference.DigestValue = hash;
        const signedInfoXML = convert.js2xml({
            SignedInfo: {
                _attributes,
                CanonicalizationMethod: this.signedInfo.CanonicalizationMethod,
                SignatureMethod: this.signedInfo.SignatureMethod,
                Reference: this.signedInfo.Reference
            }
        //}, this.signOpts).split('\n').map(e => e.trim()).join('\n');
        }, this.signOpts).split('\n').map(e => e).join('\n');

        let signature = this.signatureValue(signedInfoXML);

        doc[root[0]].Signature = {
            _attributes: {
                xmlns: 'http://www.w3.org/2000/09/xmldsig#'
            },
            SignedInfo: this.signedInfo,
            SignatureValue: signature,
            KeyInfo: {
                X509Data: {
                    X509Certificate: this.certificate.split('\r').join('')
                }
            }
        };
        let flag = false;

        const xmlSigned = convert.js2xml(doc, this.signOpts).split('\n').map(e => {
            if (e.indexOf('<Signature') >= 0) {
                flag = true;
            }
            if (e.indexOf('</Signature>') >= 0) {
                flag = false;
                //return e.trim();
                return e;
            }
            if (flag) {
                //return e.trim();
                return e;
            } else {
                return e;
            }
        }).join('\n').replace('</Signature>\n', '</Signature>\n');
        
        token.clean();

        return xmlSigned;
    }

    /*digest(xml) {
        var sha256 = crypto.createHash('sha256');

        sha256.update(xml, 'utf8');
        return sha256.digest('base64');
    }*/
    
    digest(xml: string) {
        const hashDigest = sha256(xml);
        const hmacDigest = Base64.stringify(hashDigest);
        return hmacDigest;
    }

    signatureValue(xml: string) {
        let privateKey = token.getPrivateKey();
        this.certificate = token.getCertificate();
        let signature = token.signature(xml, privateKey);
        return Buffer.from(signature, 'binary').toString('base64');
    }

    getCertificate() {
        let certificate = token.getCertificate();
        return `-----BEGIN CERTIFICATE-----${certificate}\n-----END CERTIFICATE-----`;
    }
}

export default new XMLDsig();

