import java.io.FileInputStream;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;

import javax.xml.parsers.DocumentBuilderFactory;

public class CertExpiration {

    public static void main(String[] args) throws Exception {
        try {

            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            dbFactory.setNamespaceAware(true);
            
            KeyStore p12 = KeyStore.getInstance("pkcs12");
    
            String passphase = args[1];
            p12.load(new FileInputStream(args[0]), passphase.toCharArray());
    
            Enumeration e = p12.aliases();
            String alias = (String) e.nextElement();
    
            KeyStore.PrivateKeyEntry keyEntry
                    = (KeyStore.PrivateKeyEntry) p12.getEntry(alias, new KeyStore.PasswordProtection(passphase.toCharArray()));
    
            X509Certificate cert = (X509Certificate) keyEntry.getCertificate();
    
            DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            
            Date notAfter = cert.getNotAfter();
            Date notBefore = cert.getNotBefore();
            
            System.out.print("{\"notBefore\" : \"" + sdf.format(notBefore) + "\", \"notAfter\" : \"" + sdf.format(notAfter) + "\"}");
        } catch (Exception e) {
            System.err.print("" + e.getMessage());
        }
		
    }


}