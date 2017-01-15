import {Config} from "./Config";
import {ConfigDev} from "./ConfigDev";
import {ConfigProd} from "./ConfigProd";

export class ConfigManager{

    private static config : Config;

    static getCurrentConfig() : Config{
        if(ConfigManager.config == null){
            var env = process.env.NODE_ENV;
            if(env == "dev"){
                ConfigManager.config = new ConfigDev();
            }else{
                ConfigManager.config = new ConfigProd();
            }
        }
        return ConfigManager.config;
    }

}