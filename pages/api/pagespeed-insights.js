import Cors from "cors";
import initMiddleware from "../../src/lib/init-middleware";
import { getPageSpeedInsights } from "../../src/utils/page-insights";

const cors = initMiddleware(
  Cors({
    origin: "*",
    methods: ["GET"],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  if (!req.query.url) return res.status(404).send("URL is required");
  if (!req.query.device) return res.status(404).send("Device is required");

  try {
    const response = await getPageSpeedInsights(
      req.query.url,
      req.query.device
    );
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(200).json(err);
  }
};

export default handler;
