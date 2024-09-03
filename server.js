const express = require('express');
import routes from './routes/index';

const app = express();
// Use json middleware
app.use(express.json());
const port = process.env.PORT || 5000;

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
