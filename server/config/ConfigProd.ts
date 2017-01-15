import {Config} from "./Config";

export class ConfigProd implements  Config{


    getConfigCassandraAddress(): string {
        return "dazdaz";
    }

    getConfigCassandraKeyspace(): string {
        return "daz";
    }

    getConfigRedisAddress(): string {
        return "redis://127.0.0.1:6379";
    }
}