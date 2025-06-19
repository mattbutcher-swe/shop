package github.com.mattbutcher_swe.shop_backend.models;

import github.com.mattbutcher_swe.shop_backend.converters.EncryptionConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "settings")
public class Setting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, name = "setting_key")
    private String settingKey;

    @Column(name = "setting_value")
    @Convert(converter = EncryptionConverter.class)
    private String settingValue;

    public Setting() {} 

    public Setting(String key, String value) {
        this.settingKey = key;
        this.settingValue = value;
    }

    public String getSettingKey() {
        return this.settingKey;
    }

    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey;
    }

    public String getSettingValue() {
        return this.settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue;
    }

    

}
