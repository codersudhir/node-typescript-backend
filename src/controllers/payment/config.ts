import { Config } from "./types";

export const config: Config = {
    key: process.env.EASEBUZZ_KEY,
    salt: process.env.EASEBUZZ_SALT,
    env: process.env.EASEBUZZ_ENV as "test" | "prod",
    enable_iframe: process.env.EASEBUZZ_IFRAME as number | undefined,
};
