"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const node_forge_1 = __importDefault(require("node-forge"));
class PKCS12 {
    openCertificate(file) {
        const pkcs12 = fs_1.default.readFileSync(file);
        this.p12Asn1 = node_forge_1.default.asn1.fromDer(pkcs12.toString('binary'));
    }
    openFile(file, passphase) {
        this.openCertificate(file);
        this.p12 = node_forge_1.default.pkcs12.pkcs12FromAsn1(this.p12Asn1, false, passphase);
    }
    clean() {
        this.p12 = undefined;
    }
    getPrivateKey() {
        for (let i = 0; i < this.p12.safeContents.length; i++) {
            if (this.p12.safeContents[i].safeBags[0].key) {
                return node_forge_1.default.pki.privateKeyToPem(this.p12.safeContents[i].safeBags[0].key);
            }
        }
        return null;
    }
    getCertificate() {
        for (let i = 0; i < this.p12.safeContents.length; i++) {
            if (this.p12.safeContents[i].safeBags[0].cert) {
                const b64 = node_forge_1.default.pki.certificateToPem(this.p12.safeContents[i].safeBags[0].cert);
                const l = b64.split('\n');
                l.pop();
                l.pop();
                l[0] = '';
                return l.join('\n');
            }
        }
        return null;
    }
    signature(xml, privateKey) {
        const md = node_forge_1.default.md.sha256.create();
        md.update(xml, 'utf8');
        var key = node_forge_1.default.pki.privateKeyFromPem(privateKey);
        return key.sign(md);
    }
}
exports.default = new PKCS12();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsNERBQStCO0FBRS9CLE1BQU0sTUFBTTtJQUlSLGVBQWUsQ0FBQyxJQUFZO1FBQ3hCLE1BQU0sTUFBTSxHQUFHLFlBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBWSxFQUFFLFNBQWlCO1FBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxvQkFBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUN6QixDQUFDO0lBRUQsYUFBYTtRQUNULEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUMxQyxPQUFPLG9CQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUU7U0FDSjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxjQUFjO1FBQ1YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzNDLE1BQU0sR0FBRyxHQUFHLG9CQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEYsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNSLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDUixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNWLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QjtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFXLEVBQUUsVUFBZTtRQUNsQyxNQUFNLEVBQUUsR0FBRyxvQkFBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDcEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxHQUFHLEdBQUcsb0JBQUssQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQUVELGtCQUFlLElBQUksTUFBTSxFQUFFLENBQUMifQ==