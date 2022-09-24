import dsig from "./XMLDsig";

class DESign {
  signXML = (xml: string, file: any, password: any): Promise<any> => {
    //return new Promise((resolve, reject) => {
    dsig.openFile(file, password);
    return dsig.signDocument(xml, "DE");
    //});
  };
  signXMLFiles = (xmls: Array<any>, file: any, password: any): Promise<any> => {
    //return new Promise((resolve, reject) => {
    dsig.openFile(file, password);
    return dsig.signDocuments(xmls, "DE");
    //});
  };
  signXMLEvento = (xml: string, file: any, password: any): Promise<any> => {
    //return new Promise((resolve, reject) => {
    dsig.openFile(file, password);
    return dsig.signEvento(xml, "DE");
    //});
  };
  signXMLRecibo = (xml: string, file: any, password: any): Promise<any> => {
    //return new Promise((resolve, reject) => {
    dsig.openFile(file, password);
    return dsig.signDocument(xml, "recibo");
    //});
  };
}

export default new DESign();
