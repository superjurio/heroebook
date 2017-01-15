
'use strict';
import {Client} from "cassandra-driver";
import {ConfigManager} from "../config/ConfigManager";


export class CassandraOperations{

    public static client : Client = new Client({ contactPoints: [ConfigManager.getCurrentConfig().getConfigCassandraAddress()], keyspace: ConfigManager.getCurrentConfig().getConfigCassandraKeyspace()});
}
