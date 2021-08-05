import Cors from 'cors';
import { getCredits } from '../../src/utils/credits';
import initMiddleware from '../../src/lib/init-middleware';

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: '*',
    methods: ['GET'],
  })
);

const handler = async (req, res) => {
  await cors(req, res);
  res.status(200).json({ credits: await getCredits() });
};

export default handler;
