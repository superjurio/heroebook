import {Config} from "./Config";

export class ConfigDev implements  Config{


    getConfigCassandraAddress(): string {
        return "127.0.0.1:9042";
    }

    getConfigRedisAddress(): string {
        return "redis://127.0.0.1:6379";
    }

    getConfigCassandraKeyspace(): string {
        return "cassandrademocql";
    }
}