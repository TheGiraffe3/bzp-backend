import cors from 'cors';
import express from 'express';
import router from './router.js';

const app = express();
const PORT = 5060;

app.use(cors());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
