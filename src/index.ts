import dsig from "./XMLDsig";

class DESign {
  signXML = (xml: string, file: any, password: any): Promise<any> => {
    //return new Promise((resolve, reject) => {
    dsig.openFile(file, password);
    return dsig.signDocument(xml, "DE");
    //});
  };
  signXMLEvento = (xml: string, file: any, password: any): Promise<any> => {
    //return new Promise((resolve, reject) => {
    dsig.openFile(file, password);
    return dsig.signEvento(xml, "DE");
    //});
  };
}

export default new DESign();
