package github.com.mattbutcher_swe.shop_backend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import github.com.mattbutcher_swe.shop_backend.repositories.SettingRepository;
import jakarta.transaction.Transactional;
import github.com.mattbutcher_swe.shop_backend.dtos.SettingDTO;
import github.com.mattbutcher_swe.shop_backend.models.Setting;

@RestController
@CrossOrigin(origins = "http://localhost")
@RequestMapping("/setting")
public class SettingController {

    @Autowired
    private SettingRepository settingRepository;

    @GetMapping
    public List<SettingDTO> getAllSettings() {
        return settingRepository.findAll().stream()
                .map(SettingDTO::toSettingDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/update")
    @Transactional
    public void updateSettings(@RequestBody List<SettingDTO> settingDTOs) {
        settingRepository.deleteAll();
        settingRepository.flush();

        for (SettingDTO settingDTO : settingDTOs) {
            Setting setting = new Setting(settingDTO.settingKey, settingDTO.settingValue);
            settingRepository.save(setting);
        }
    }
}
