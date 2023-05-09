import { Options } from "@mikro-orm/core";

const config: Options = {
    entitiesTs: ["../entities"], // path to our TS entities (src), relative to `baseDir`
    dbName: "project_manager_mikro",
    type: "mysql", // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
};

export default config;
