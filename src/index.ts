import dsig from './XMLDsig';

class DESign {
    signXML = (xml: string, file: any, password: any) : Promise<any> => {
        return new Promise((resolve, reject) => {
            dsig.openFile(file, password);
            resolve( dsig.signDocument(xml, 'DE') );
        });

    }
}

export default new DESign();
