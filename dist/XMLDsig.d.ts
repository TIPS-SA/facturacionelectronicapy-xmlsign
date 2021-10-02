declare class XMLDsig {
    private signOpts;
    private signedInfo;
    private certificate;
    constructor();
    openFile(file: string, passphase: string): void;
    setXMLSignOpts(): void;
    signDocument(xml: string, tag: any): string;
    digest(xml: string): string;
    signatureValue(xml: string): string;
    getCertificate(): string;
}
declare const _default: XMLDsig;
export default _default;
