package github.com.mattbutcher_swe.shop_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import github.com.mattbutcher_swe.shop_backend.models.Setting;

public interface SettingRepository extends JpaRepository<Setting, Long> {
}