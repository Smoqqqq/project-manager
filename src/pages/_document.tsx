import { MikroORM, MySqlDriver } from "@mikro-orm/mysql";
import { Html, Head, Main, NextScript } from "next/document";
import config from "../../mikro-orm.config";

export default function Document() {
    async function initOrm() {
        const orm = await MikroORM.init(config);
        console.log(orm.em); // access EntityManager via `em` property
    }

    initOrm();

    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <div id="page-container">
                    <Main />
                </div>
                <NextScript />
            </body>
        </Html>
    );
}
