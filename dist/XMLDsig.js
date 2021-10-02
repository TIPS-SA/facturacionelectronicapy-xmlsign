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
            if (!doc[root[0]][tag]) {
                //                doc[root[0]][tag]._attributes = { id: tag };
                //            } else {
                throw new Error('Tag ' + tag + ' no encontrado en el Archivo XML');
            }
            //console.log("===>", doc[root[0]][tag]);
            const idTag = doc[root[0]][tag]._attributes.Id;
            this.signedInfo.Reference._attributes.URI = `#${idTag}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWE1MRHNpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9YTUxEc2lnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTZCO0FBQzdCLDhEQUFzQztBQUN0QyxzRUFBMEM7QUFDMUMsc0RBQTZCO0FBRTdCLE1BQU0sT0FBTztJQU1UO0lBQ0EsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZLEVBQUUsU0FBaUI7UUFDcEMsZ0JBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxRQUFRLEdBQUc7WUFDWixPQUFPLEVBQUUsSUFBSTtZQUNiLGFBQWEsRUFBRSxJQUFJO1lBQ25CLE1BQU0sRUFBRSxDQUFDO1lBQ1QsbUJBQW1CLEVBQUUsSUFBSTtTQUM1QixDQUFDO1FBQ0YsSUFBSSxDQUFDLFVBQVUsR0FBRztZQUNkLHNCQUFzQixFQUFFO2dCQUNwQixXQUFXLEVBQUU7b0JBQ1QsU0FBUyxFQUFFLHlDQUF5QztpQkFDdkQ7YUFDSjtZQUNELGVBQWUsRUFBRTtnQkFDYixXQUFXLEVBQUU7b0JBQ1QsU0FBUyxFQUFFLG1EQUFtRDtpQkFDakU7YUFDSjtZQUNELFNBQVMsRUFBRTtnQkFDUCxXQUFXLEVBQUU7b0JBQ1QsR0FBRyxFQUFFLEVBQUU7aUJBQ1Y7Z0JBQ0QsVUFBVSxFQUFFO29CQUNSLFNBQVMsRUFBRTt3QkFDUDs0QkFDSSxXQUFXLEVBQUU7Z0NBQ1QsU0FBUyxFQUFFLHVEQUF1RDs2QkFDckU7eUJBQ0osRUFBRTs0QkFDQyxXQUFXLEVBQUU7Z0NBQ1QsU0FBUyxFQUFFLHlDQUF5Qzs2QkFDdkQ7eUJBQ0o7cUJBQ0o7aUJBQ0o7Z0JBQ0QsWUFBWSxFQUFFO29CQUNWLFdBQVcsRUFBRTt3QkFDVCxTQUFTLEVBQUUseUNBQXlDO3FCQUN2RDtpQkFDSjtnQkFDRCxXQUFXLEVBQUUsRUFBRTthQUNsQjtTQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQVcsRUFBRSxHQUFRO1FBRTlCLE1BQU0sR0FBRyxHQUFRLGdCQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEQsTUFBTSxJQUFJLEdBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssY0FBYyxDQUFDLENBQUM7UUFFekUsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDOUM7UUFDRCxNQUFNLFdBQVcsR0FBUztZQUN0QixLQUFLLEVBQUUsb0NBQW9DO1NBQzlDLENBQUM7UUFDRixJQUFJLEdBQUcsRUFBRTtZQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BDLDhEQUE4RDtnQkFDOUQsc0JBQXNCO2dCQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxrQ0FBa0MsQ0FBQyxDQUFDO2FBQ3RFO1lBQ0QseUNBQXlDO1lBQ3pDLE1BQU0sS0FBSyxHQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztTQUMzRDtRQUVELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtZQUMxQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsTUFBTSxTQUFTLEdBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ2hDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUNoRTthQUNKO1NBQ0o7UUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVyRixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQzdDLE1BQU0sYUFBYSxHQUFHLGdCQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2pDLFVBQVUsRUFBRTtnQkFDUixXQUFXO2dCQUNYLHNCQUFzQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsc0JBQXNCO2dCQUM5RCxlQUFlLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlO2dCQUNoRCxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTO2FBQ3ZDO1lBQ0wsOERBQThEO1NBQzdELEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVuRCxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHO1lBQ3JCLFdBQVcsRUFBRTtnQkFDVCxLQUFLLEVBQUUsb0NBQW9DO2FBQzlDO1lBQ0QsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLGNBQWMsRUFBRSxTQUFTO1lBQ3pCLE9BQU8sRUFBRTtnQkFDTCxRQUFRLEVBQUU7b0JBQ04sZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7aUJBQ3pEO2FBQ0o7U0FDSixDQUFDO1FBQ0YsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBRWpCLE1BQU0sU0FBUyxHQUFHLGdCQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2Y7WUFDRCxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUNiLGtCQUFrQjtnQkFDbEIsT0FBTyxDQUFDLENBQUM7YUFDWjtZQUNELElBQUksSUFBSSxFQUFFO2dCQUNOLGtCQUFrQjtnQkFDbEIsT0FBTyxDQUFDLENBQUM7YUFDWjtpQkFBTTtnQkFDSCxPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTFELGdCQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFFSCxNQUFNLENBQUMsR0FBVztRQUNkLE1BQU0sVUFBVSxHQUFHLGdCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsTUFBTSxVQUFVLEdBQUcsb0JBQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUVELGNBQWMsQ0FBQyxHQUFXO1FBQ3RCLElBQUksVUFBVSxHQUFHLGdCQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxnQkFBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFDLElBQUksU0FBUyxHQUFHLGdCQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksV0FBVyxHQUFHLGdCQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDekMsT0FBTyw4QkFBOEIsV0FBVyw2QkFBNkIsQ0FBQztJQUNsRixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxJQUFJLE9BQU8sRUFBRSxDQUFDIn0=