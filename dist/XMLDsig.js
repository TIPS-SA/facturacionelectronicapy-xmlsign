"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml_js_1 = __importDefault(require("xml-js"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
const PKCS12_1 = __importDefault(require("./PKCS12"));
class XMLDsig {
    constructor() {
    }
    openFile(file, passphase) {
        PKCS12_1.default.openFile(file, passphase);
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
                    Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
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
                                Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments'
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
    signDocument(xml, tag) {
        const doc = xml_js_1.default.xml2js(xml, this.signOpts);
        const root = Object.keys(doc).filter(key => key !== '_declaration');
        if (root.length !== 1) {
            throw new Error('Debe ser un Archivo XML');
        }
        const _attributes = {
            xmlns: 'http://www.w3.org/2000/09/xmldsig#'
        };
        if (tag) {
            if (doc[root[0]][tag]) {
                doc[root[0]][tag]._attributes = { id: tag };
            }
            else {
                throw new Error('Tag ' + tag + ' no encontrado en el Archivo XML');
            }
            this.signedInfo.Reference._attributes.URI = `#${tag}`;
        }
        if (doc[root[0]]._attributes) {
            const attributes = Object.keys(doc[root[0]]._attributes);
            for (let i = 0; i < attributes.length; i++) {
                const attribute = attributes[i];
                if (attribute.startsWith('xmlns:')) {
                    _attributes[attribute] = doc[root[0]]._attributes[attribute];
                }
            }
        }
        const hash = this.digest(xml_js_1.default.js2xml({ [root[0]]: doc[root[0]] }, this.signOpts));
        this.signedInfo.Reference.DigestValue = hash;
        const signedInfoXML = xml_js_1.default.js2xml({
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
        const xmlSigned = xml_js_1.default.js2xml(doc, this.signOpts).split('\n').map(e => {
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
            }
            else {
                return e;
            }
        }).join('\n').replace('</Signature>\n', '</Signature>\n');
        PKCS12_1.default.clean();
        return xmlSigned;
    }
    /*digest(xml) {
        var sha256 = crypto.createHash('sha256');

        sha256.update(xml, 'utf8');
        return sha256.digest('base64');
    }*/
    digest(xml) {
        const hashDigest = sha256_1.default(xml);
        const hmacDigest = enc_base64_1.default.stringify(hashDigest);
        return hmacDigest;
    }
    signatureValue(xml) {
        let privateKey = PKCS12_1.default.getPrivateKey();
        this.certificate = PKCS12_1.default.getCertificate();
        let signature = PKCS12_1.default.signature(xml, privateKey);
        return Buffer.from(signature, 'binary').toString('base64');
    }
    getCertificate() {
        let certificate = PKCS12_1.default.getCertificate();
        return `-----BEGIN CERTIFICATE-----${certificate}\n-----END CERTIFICATE-----`;
    }
}
exports.default = new XMLDsig();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWE1MRHNpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YTUxEc2lnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTZCO0FBQzdCLDhEQUFzQztBQUN0QyxzRUFBMEM7QUFDMUMsc0RBQTZCO0FBRTdCLE1BQU0sT0FBTztJQU1UO0lBQ0EsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZLEVBQUUsU0FBaUI7UUFDcEMsZ0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxRQUFRLEdBQUc7WUFDWixPQUFPLEVBQUUsSUFBSTtZQUNiLGFBQWEsRUFBRSxJQUFJO1lBQ25CLE1BQU0sRUFBRSxDQUFDO1lBQ1QsbUJBQW1CLEVBQUUsSUFBSTtTQUM1QixDQUFDO1FBQ0YsSUFBSSxDQUFDLFVBQVUsR0FBRztZQUNkLHNCQUFzQixFQUFFO2dCQUNwQixXQUFXLEVBQUU7b0JBQ1QsU0FBUyxFQUFFLGlEQUFpRDtpQkFDL0Q7YUFDSjtZQUNELGVBQWUsRUFBRTtnQkFDYixXQUFXLEVBQUU7b0JBQ1QsU0FBUyxFQUFFLG1EQUFtRDtpQkFDakU7YUFDSjtZQUNELFNBQVMsRUFBRTtnQkFDUCxXQUFXLEVBQUU7b0JBQ1QsR0FBRyxFQUFFLEVBQUU7aUJBQ1Y7Z0JBQ0QsVUFBVSxFQUFFO29CQUNSLFNBQVMsRUFBRTt3QkFDUDs0QkFDSSxXQUFXLEVBQUU7Z0NBQ1QsU0FBUyxFQUFFLHVEQUF1RDs2QkFDckU7eUJBQ0osRUFBRTs0QkFDQyxXQUFXLEVBQUU7Z0NBQ1QsU0FBUyxFQUFFLDhEQUE4RDs2QkFDNUU7eUJBQ0o7cUJBQ0o7aUJBQ0o7Z0JBQ0QsWUFBWSxFQUFFO29CQUNWLFdBQVcsRUFBRTt3QkFDVCxTQUFTLEVBQUUseUNBQXlDO3FCQUN2RDtpQkFDSjtnQkFDRCxXQUFX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