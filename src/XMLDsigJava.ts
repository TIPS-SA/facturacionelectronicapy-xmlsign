import findJavaHome from "find-java-home";

const { exec } = require("child_process");
var fs = require("fs");

class XMLDsig {
  constructor() {}

  /**
   * Firma con Java, retornando el documento firmado en el buffer de salida
   * @param xml
   * @param tag
   * @returns
   */
  async signDocument(xml: string, tag: any, file: any, passphase: any) {
    return new Promise(async (resolve, reject) => {
      findJavaHome({ allowJre: true }, (err: any, java8Path: any) => {
        java8Path += "/bin/java";
        if (err) return console.log(err);

        //Comentar esta linea al llevar a Produccion, por que aqui trae java 6
        if (process.env.java8_home) {
          //java8Path = `"C:\\Program Files\\Java\\jdk1.8.0_221\\bin\\java"`;
          java8Path = `${process.env.java8_home}`;
        }

        const classPath = "" + __dirname + "";
        //const tmpXMLToSign = "" + __dirname + "/xml_sign_temp.xml";
        const tmpXMLToSign =
          "" +
          __dirname +
          "/xml_sign_temp_" +
          Math.round(Math.random() * 999999) +
          ".xml";

        fs.writeFileSync(tmpXMLToSign, xml, { encoding: "utf8" });

        exec(
          `"${java8Path}" -Dfile.encoding=IBM850 -classpath "${classPath}" SignXML "${tmpXMLToSign}" "${file}" "${passphase}" "${tag}"`,
          { encoding: "UTF-8" },
          (error: any, stdout: any, stderr: any) => {
            let entro = 0;
            if (entro == 0) {
              //Evita hacer 2 veces reject
              if (stderr) {
                entro++;

                console.log(stderr.cmd);
                stderr.code = stderr.killed = stderr.signal = stderr.cmd = null;

                reject(stderr);
              }
            }

            if (entro == 0) {
              //Evita hacer 2 veces reject
              if (error) {
                entro++;
                console.log(error.cmd);
                error.code = error.killed = error.signal = error.cmd = null;

                reject(error);
              }
            }

            try {
              fs.unlinkSync(tmpXMLToSign);
              //file removed
            } catch (err) {}

            //console.log(`signedXML: ${stdout}`);

            //resolve(Buffer.from(`${stdout}`,'utf8').toString());
            //fs.writeFileSync(tmpXMLToSign + ".result.xml", `${stdout}`, {encoding: 'utf8'});
            //let resultXML = fs.readFileSync(tmpXMLToSign + ".result.xml", {encoding: 'utf8'});
            resolve(`${stdout}`);
          }
        );
      });
    });
  }

  /**
   * Firma con Java, varios documentos al mismo tiempo
   * @param xml
   * @param tag
   * @returns
   */
  async signDocuments(xmls: Array<any>, tag: any, file: any, passphase: any) {
    return new Promise(async (resolve, reject) => {
      //console.log("A firmar", xml);

      findJavaHome({ allowJre: true }, (err: any, java8Path: any) => {
        java8Path += "/bin/java";
        if (err) return console.log(err);

        //Comentar esta linea al llevar a Produccion, por que aqui trae java 6
        if (process.env.java8_home) {
          //java8Path = `"C:\\Program Files\\Java\\jdk1.8.0_221\\bin\\java"`;
          java8Path = `${process.env.java8_home}`;
        }

        const classPath = "" + __dirname + "";
        //const tmpXMLToSign = "" + __dirname + "/xml_sign_temp.xml";
        const arrayNameFiles = new Array();

        for (let i = 0; i < xmls.length; i++) {
          const xml = xmls[i];

          const tmpXMLToSign =
            "" +
            __dirname +
            "/xml_sign_temp_" +
            Math.round(Math.random() * 999999) +
            ".xml";

          fs.writeFileSync(tmpXMLToSign, xml, { encoding: "utf8" });

          arrayNameFiles.push(tmpXMLToSign);
        }

        exec(
          `"${java8Path}" -Dfile.encoding=IBM850 -classpath "${classPath}" SignXMLFiles "${arrayNameFiles.join(
            ","
          )}" "${file}" "${passphase}" "${tag}"`,
          { encoding: "UTF-8" },
          (error: any, stdout: any, stderr: any) => {
            let stdOutProcesed = stdout;
            /*console.log("error", error);
            console.log("stdout", stdout);
            console.log("stderr", stderr);
            */
            if (stdOutProcesed.includes("_SEPARATOR_")) {
              //Por si haya algun log que quedo en la colita, entonces elimina ese
              stdOutProcesed = stdout.substring(
                0,
                stdout.lastIndexOf("_SEPARATOR_") + 11
              );
            }
            let entro = 0;
            if (entro == 0) {
              if (stderr) {
                if (!stdOutProcesed.includes("_SEPARATOR_")) {
                  entro++;
                  console.log(stderr.cmd);
                  stderr.code =
                    stderr.killed =
                    stderr.signal =
                    stderr.cmd =
                      null;

                  reject(stderr);
                }
              }
            }
            if (entro == 0) {
              if (error) {
                if (!stdOutProcesed.includes("_SEPARATOR_")) {
                  entro++;
                  console.log(error.cmd);
                  error.code = error.killed = error.signal = error.cmd = null;

                  reject(error);
                }
              }
            }

            try {
              for (let i = 0; i < arrayNameFiles.length; i++) {
                const nameFile = arrayNameFiles[i];
                fs.unlinkSync(nameFile);
              }
              //file removed
            } catch (err) {
              console.error(err);
            }

            //console.log(`signedXML: ${stdout}`);

            //resolve(Buffer.from(`${stdout}`,'utf8').toString());
            //fs.writeFileSync(tmpXMLToSign + ".result.xml", `${stdout}`, {encoding: 'utf8'});
            //let resultXML = fs.readFileSync(tmpXMLToSign + ".result.xml", {encoding: 'utf8'});
            resolve(`${stdOutProcesed}`);
          }
        );
      });
    });
  }

  /**
   * Firma el XML del Evento con Java
   * @param xml
   * @param tag
   * @returns
   */
  async signEvento(xml: string, tag: any, file: any, passphase: any) {
    return new Promise(async (resolve, reject) => {
      findJavaHome({ allowJre: true }, (err: any, java8Path: any) => {
        java8Path += "/bin/java";
        if (err) return console.log(err);

        //Comentar esta linea al llevar a Produccion, por que aqui trae java 6
        if (process.env.java8_home) {
          //java8Path = `"C:\\Program Files\\Java\\jdk1.8.0_221\\bin\\java"`;
          java8Path = `${process.env.java8_home}`;
        }

        const classPath = "" + __dirname + "";
        const tmpXMLToSign = "" + __dirname + "/xml_sign_temp.xml";

        fs.writeFileSync(tmpXMLToSign, xml, { encoding: "utf8" });

        exec(
          `"${java8Path}" -Dfile.encoding=IBM850 -classpath "${classPath}" SignXMLEvento "${tmpXMLToSign}" "${file}" "${passphase}"`,
          { encoding: "UTF-8" },
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              reject(error);
            }
            if (stderr) {
              reject(stderr);
            }

            try {
              fs.unlinkSync(tmpXMLToSign);
              //file removed
            } catch (err) {
              console.error(err);
            }

            //console.log(`signedXML: ${stdout}`);

            //resolve(Buffer.from(`${stdout}`,'utf8').toString());
            //fs.writeFileSync(tmpXMLToSign + ".result.xml", `${stdout}`, {encoding: 'utf8'});
            //let resultXML = fs.readFileSync(tmpXMLToSign + ".result.xml", {encoding: 'utf8'});
            resolve(`${stdout}`);
          }
        );
      });
    });
  }

  /**
   * Firma con Java, retornando el documento firmado en el buffer de salida
   * @param xml
   * @param tag
   * @returns
   */
  async getExpiration(file: any, passphase: any) {
    return new Promise(async (resolve, reject) => {
      findJavaHome({ allowJre: true }, (err: any, java8Path: any) => {
        java8Path += "/bin/java";
        if (err) return console.log(err);

        //Comentar esta linea al llevar a Produccion, por que aqui trae java 6
        if (process.env.java8_home) {
          //java8Path = `"C:\\Program Files\\Java\\jdk1.8.0_221\\bin\\java"`;
          java8Path = `${process.env.java8_home}`;
        }

        const classPath = "" + __dirname + "";

        exec(
          `"${java8Path}" -Dfile.encoding=IBM850 -classpath "${classPath}" CertExpiration "${file}" "${passphase}"`,
          { encoding: "UTF-8" },
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              reject(error);
            }
            if (stderr) {
              reject(stderr);
            }

            try {
              //file removed
            } catch (err) {
              console.error(err);
            }

            resolve(`${stdout}`);
          }
        );
      });
    });
  }
}

export default new XMLDsig();
