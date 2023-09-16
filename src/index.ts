import dsig from "./XMLDsig";

class DESign {
  signXML = (xml: string, file: any, password: any): Promise<any> => {
    dsig.openFile(file, password);
    //return dsig.signDocument(xml, "DE");
    return dsig.signDocumentsWithNodeJS([xml], "DE", file, password);

  };
  signXMLFiles = (xmls: Array<any>, file: any, password: any): Promise<any> => {
    dsig.openFile(file, password);
    //return dsig.signDocuments(xmls, "DE");
    return dsig.signDocumentsWithNodeJS(xmls, "DE", file, password);
  };

  signXMLEvento = (xml: string, file: any, password: any): Promise<any> => {
    dsig.openFile(file, password);
    //return dsig.signEvento(xml, "DE");
    return dsig.signDocumentsWithNodeJS([xml], "DE", file, password);
  };

  signXMLRecibo = (xml: string, file: any, password: any): Promise<any> => {
    dsig.openFile(file, password);
    //return dsig.signDocument(xml, "recibo");
    return dsig.signDocumentsWithNodeJS([xml], "DE", file, password);

  };

  getExpiration = (file: any, password: any): Promise<any> => {
    dsig.openFile(file, password);
    return dsig.getExpiration();
  };
}

export default new DESign();
