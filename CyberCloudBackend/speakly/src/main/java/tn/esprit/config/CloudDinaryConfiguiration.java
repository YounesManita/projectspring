package tn.esprit.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudDinaryConfiguiration {
    private  final String Cloud_Name="df5xsjsak";
    private  final String Api_Key="174531824619371";
    private  final String Api_Secret="rnThylK7z3uHm73a7FsAnn7uBGg";

    @Bean
    public Cloudinary cloudinary(){
        Map<String,Object> config = new HashMap<String,Object>();
        config.put("cloud_name",Cloud_Name);
        config.put("api_key",Api_Key);
        config.put("api_secret",Api_Secret);
        return new Cloudinary(config);

    }
}
