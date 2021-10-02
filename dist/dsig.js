"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml_js_1 = __importDefault(require("xml-js"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
const token_1 = __importDefault(require("./token"));
class XMLDsig {
    constructor() {
    }
    openFile(file, passphase) {
        token_1.default.openFile(file, passphase);
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
        token_1.default.clean();
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
        let privateKey = token_1.default.getPrivateKey();
        this.certificate = token_1.default.getCertificate();
        let signature = token_1.default.signature(xml, privateKey);
        return Buffer.from(signature, 'binary').toString('base64');
    }
    getCertificate() {
        let certificate = token_1.default.getCertificate();
        return `-----BEGIN CERTIFICATE-----${certificate}\n-----END CERTIFICATE-----`;
    }
}
exports.default = new XMLDsig();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHNpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9kc2lnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTZCO0FBQzdCLDhEQUFzQztBQUN0QyxzRUFBMEM7QUFDMUMsb0RBQTRCO0FBRTVCLE1BQU0sT0FBTztJQU1UO0lBQ0EsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZLEVBQUUsU0FBaUI7UUFDcEMsZUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNaLE9BQU8sRUFBRSxJQUFJO1lBQ2IsYUFBYSxFQUFFLElBQUk7WUFDbkIsTUFBTSxFQUFFLENBQUM7WUFDVCxtQkFBbUIsRUFBRSxJQUFJO1NBQzVCLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxHQUFHO1lBQ2Qsc0JBQXNCLEVBQUU7Z0JBQ3BCLFdBQVcsRUFBRTtvQkFDVCxTQUFTLEVBQUUsaURBQWlEO2lCQUMvRDthQUNKO1lBQ0QsZUFBZSxFQUFFO2dCQUNiLFdBQVcsRUFBRTtvQkFDVCxTQUFTLEVBQUUsbURBQW1EO2lCQUNqRTthQUNKO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLFdBQVcsRUFBRTtvQkFDVCxHQUFHLEVBQUUsRUFBRTtpQkFDVjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1IsU0FBUyxFQUFFO3dCQUNQOzRCQUNJLFdBQVcsRUFBRTtnQ0FDVCxTQUFTLEVBQUUsdURBQXVEOzZCQUNyRTt5QkFDSixFQUFFOzRCQUNDLFdBQVcsRUFBRTtnQ0FDVCxTQUFTLEVBQUUsOERBQThEOzZCQUM1RTt5QkFDSjtxQkFDSjtpQkFDSjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1YsV0FBVyxFQUFFO3dCQUNULFNBQVMsRUFBRSx5Q0FBeUM7cUJBQ3ZEO2lCQUNKO2dCQUNELFdBQVcsRUFBRSxF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