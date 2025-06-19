package github.com.mattbutcher_swe.shop_backend.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Converter
public class EncryptionConverter implements AttributeConverter<String, String> {

    private static final String ALGO = "AES";
    private static final byte[] KEY = "MySuperSecretKey".getBytes(); // 16-byte key

    private Cipher getCipher(int mode) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(KEY, ALGO);
        Cipher cipher = Cipher.getInstance(ALGO);
        cipher.init(mode, keySpec);
        return cipher;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        try {
            if (attribute == null) return null;
            Cipher cipher = getCipher(Cipher.ENCRYPT_MODE);
            return Base64.getEncoder().encodeToString(cipher.doFinal(attribute.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Could not encrypt", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null) return null;
            Cipher cipher = getCipher(Cipher.DECRYPT_MODE);
            return new String(cipher.doFinal(Base64.getDecoder().decode(dbData)));
        } catch (Exception e) {
            throw new RuntimeException("Could not decrypt", e);
        }
    }
}
