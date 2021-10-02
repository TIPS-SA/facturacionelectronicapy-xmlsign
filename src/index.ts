import dsig from './XMLDsig';

class DESign {
    signXML = (file: any, password: any, xml: string, tag: any) : Promise<any> => {
        return new Promise((resolve, reject) => {
            dsig.openFile(file, password);
            resolve( dsig.signDocument(xml, tag) );
        });

    }
}

export default new DESign();
