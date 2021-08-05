import Cors from "cors";
import initMiddleware from "../../src/lib/init-middleware";
import { simulateSearchEngine } from "../../src/utils/search-engine";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: "*",
    methods: ["GET"],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  const url = req.query.url;

  if (!url) {
    return res.status(404).send("Not Found");
  }

  const searchEngineResult = await simulateSearchEngine(url);
  res.status(200).json(searchEngineResult);
};

export default handler;
