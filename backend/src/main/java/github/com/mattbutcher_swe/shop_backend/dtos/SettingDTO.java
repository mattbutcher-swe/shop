package github.com.mattbutcher_swe.shop_backend.dtos;

import github.com.mattbutcher_swe.shop_backend.models.Setting;

public class SettingDTO {
    public Long id;
    public String settingKey;
    public String settingValue;

    public static SettingDTO toSettingDTO(Setting setting) {

        SettingDTO settingDTO = new SettingDTO();
        settingDTO.settingKey = setting.getSettingKey();
        settingDTO.settingValue = setting.getSettingValue();

        return settingDTO;
    }
}
