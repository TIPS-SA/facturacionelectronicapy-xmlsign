import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.Key;
import java.security.KeyStore;
import java.security.PublicKey;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

import javax.xml.crypto.dsig.CanonicalizationMethod;
import javax.xml.crypto.dsig.DigestMethod;
import javax.xml.crypto.dsig.Reference;
import javax.xml.crypto.dsig.SignatureMethod;
import javax.xml.crypto.dsig.SignedInfo;
import javax.xml.crypto.dsig.Transform;
import javax.xml.crypto.dsig.XMLSignature;
import javax.xml.crypto.dsig.XMLSignatureFactory;
import javax.xml.crypto.dsig.dom.DOMSignContext;
import javax.xml.crypto.dsig.keyinfo.KeyInfo;
import javax.xml.crypto.dsig.keyinfo.KeyInfoFactory;
import javax.xml.crypto.dsig.keyinfo.X509Data;
import javax.xml.crypto.dsig.keyinfo.X509IssuerSerial;
import javax.xml.crypto.dsig.spec.C14NMethodParameterSpec;
import javax.xml.crypto.dsig.spec.TransformParameterSpec;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

/**
 * This is a simple example of validating an XML
 * Signature using the JSR 105 API. It assumes the key needed to
 * validate the signature is contained in a KeyValue KeyInfo.
 * https://gist.github.com/rponte/646a4259a2e012e4aca50f2bb02e796f
 */
public class SignXMLFiles {
	private static final String C14NEXC = "http://www.w3.org/2001/10/xml-exc-c14n#";


	/**
	 *                                          0                1            2                3
	 * java -Dfile.encoding=IBM850 SignXMLFiles "/path/to/xmls/" "/cert/path" "cert_passphase" "TAG"`,
	 * @param args
	 * @throws Exception
	 */
    public static void main(String[] args) throws Exception {
    	DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        dbFactory.setNamespaceAware(true);
        
		DocumentBuilder builder = dbFactory.newDocumentBuilder();
        KeyStore p12 = KeyStore.getInstance("pkcs12");

        String [] xmlPaths = args[0].split(",");
        
    	String passphase = args[2];
    	String tagToSign = args[3] != null ? args[3] : "DE";

        p12.load(new FileInputStream(args[1]), passphase.toCharArray());

        Enumeration e = p12.aliases();
        String alias = (String) e.nextElement();

        Key privateKey = p12.getKey(alias, passphase.toCharArray());

        KeyStore.PrivateKeyEntry keyEntry
                = (KeyStore.PrivateKeyEntry) p12.getEntry(alias, new KeyStore.PasswordProtection(passphase.toCharArray()));

        X509Certificate cert = (X509Certificate) keyEntry.getCertificate();

        PublicKey publicKey = cert.getPublicKey();
        final XMLSignatureFactory sigFactory = XMLSignatureFactory.getInstance("DOM");

        Transform envelopedTransform = sigFactory.newTransform(Transform.ENVELOPED, (TransformParameterSpec) null);
		Transform c14NEXCTransform = sigFactory.newTransform(C14NEXC, (TransformParameterSpec) null);
		List<Transform> transforms = Arrays.asList(envelopedTransform, c14NEXCTransform);

        for (int i = 0; i < xmlPaths.length; i++) {
            String xmlPath = xmlPaths[i];
            
       		Document doc = (Document) builder.parse(new File(xmlPath));
    		
            Node afterNode = doc.getElementsByTagName(tagToSign).item(0);
            String id = afterNode.getAttributes().getNamedItem("Id").getNodeValue();
            //System.out.println("-----------------------------------\n" + id );
            // Create a Reference to the enveloped document
    		DigestMethod digestMethod = sigFactory.newDigestMethod(DigestMethod.SHA256, null);
    		Reference ref = sigFactory.newReference("#" + id,
                    digestMethod,
                    transforms,
                    null,
                    null);

    		CanonicalizationMethod canonicalizationMethod = sigFactory.newCanonicalizationMethod(CanonicalizationMethod.EXCLUSIVE, (C14NMethodParameterSpec) null);
    		SignatureMethod signatureMethod = sigFactory.newSignatureMethod("http://www.w3.org/2001/04/xmldsig-more#rsa-sha256", null);
            SignedInfo si = sigFactory.newSignedInfo(canonicalizationMethod, signatureMethod, Collections.singletonList(ref));

            // Create a KeyValue containing the RSA PublicKey
            KeyInfoFactory keyInfoFactory = sigFactory.getKeyInfoFactory();

            X509IssuerSerial x509IssuerSerial = keyInfoFactory.newX509IssuerSerial(cert.getSubjectX500Principal().getName(), cert.getSerialNumber());

            List x509Content = new ArrayList();

            //x509Content.add(cert.getSubjectX500Principal().getName());
            //x509Content.add(x509IssuerSerial);
            x509Content.add(Collections.singletonList(cert));

            //KeyValue keyValue = keyInfoFactory.newKeyValue(publicKey);
            
            //X509Data x509Data = keyInfoFactory.newX509Data(Collections.singletonList(certificate));

            X509Data xd = keyInfoFactory.newX509Data(Collections.singletonList(cert));

            // Create a KeyInfo and add the KeyValue to it
            KeyInfo keyInfo = keyInfoFactory.newKeyInfo(Collections.singletonList(xd));

            //Node node = doc.getElementsByTagName("rDE").item(0);

            
            // Create a DOMSignContext and specify the RSA PrivateKey and
            // location of the resulting XMLSignature's parent element
            DOMSignContext dsc = new DOMSignContext(
                    privateKey,
                    doc.getFirstChild()
            );
            ((Element) afterNode).setIdAttribute("Id", true);
            //dsc.setIdAttributeNS((Element)node, "http://ekuatia.set.gov.py/sifen/xsd/DE_v150.xsd", "Id");
            
            // Adds <Signature> tag before a specific tag inside XML - with or without namespace
     		/*
     		Node assertionTag = doc.getElementsByTagName("saml2:Assertion").item(0);
     		Node afterTag = doc.getElementsByTagName("saml2:Subject").item(0);
     		DOMSignContext dsc = new DOMSignContext(key, assertionTag, afterTag);
     		dsc.setDefaultNamespacePrefix("ds");
     		*/
            
            // Create the XMLSignature (but don't sign it yet)
            XMLSignature signature = sigFactory.newXMLSignature(si, keyInfo);

            // Marshal, generate (and sign) the enveloped signature
            signature.sign(dsc);
            
            
            
            
            
            
            ByteArrayOutputStream output = new ByteArrayOutputStream();
    		TransformerFactory.newInstance()
                          .newTransformer()
                          .transform(new DOMSource(doc), new StreamResult(output));
    		
    		//String rawSignedXml = new String(output.toByteArray(), StandardCharsets.UTF_8);
    		
    		//System.out.println(rawSignedXml);
    		
    		output.writeTo(System.out);
    		getByteArray("_SEPARATOR_").writeTo(System.out);
    		//SignedXml xml = new SignedXml(rawSignedXml);
    		//return xml;
            //String retorno = new String(signature.getSignatureValue().getValue());
            //System.out.println(retorno);
            //System.out.println(si.);            

		}

    }


    public static ByteArrayOutputStream getByteArray(String data) {

    	ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    	DataOutputStream out = new DataOutputStream(byteArrayOutputStream);
    		
    	try {
    		out.write(data.getBytes());
    		byteArrayOutputStream.flush();
    		byteArrayOutputStream.close();
    	} catch (IOException e) {
    		e.printStackTrace();
    	}

    	return byteArrayOutputStream;

    }
}