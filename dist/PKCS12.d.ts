declare class PKCS12 {
    private p12Asn1;
    private p12;
    openCertificate(file: string): void;
    openFile(file: string, passphase: string): void;
    clean(): void;
    getPrivateKey(): string | null;
    getCertificate(): string | null;
    signature(xml: string, privateKey: any): string;
}
declare const _default: PKCS12;
export default _default;
