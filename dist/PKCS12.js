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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUEtDUzEyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BLQ1MxMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRDQUFvQjtBQUNwQiw0REFBK0I7QUFFL0IsTUFBTSxNQUFNO0lBSVIsZUFBZSxDQUFDLElBQVk7UUFDeEIsTUFBTSxNQUFNLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLG9CQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZLEVBQUUsU0FBaUI7UUFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsR0FBRyxHQUFHLG9CQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxhQUFhO1FBQ1QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQzFDLE9BQU8sb0JBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM5RTtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELGNBQWM7UUFDVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25ELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDM0MsTUFBTSxHQUFHLEdBQUcsb0JBQUssQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsRixNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ1IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNSLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ1YsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQVcsRUFBRSxVQUFlO1FBQ2xDLE1BQU0sRUFBRSxHQUFHLG9CQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLEdBQUcsR0FBRyxvQkFBSyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNKO0FBRUQsa0JBQWUsSUFBSSxNQUFNLEVBQUUsQ0FBQyJ9