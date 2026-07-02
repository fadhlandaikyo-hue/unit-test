import "dotenv/config";
import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

const port = process.env.PORT || 3000;

web.listen(3000, () => {
    logger.info("App start");
});
