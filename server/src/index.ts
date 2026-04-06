import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/targets', (req, res) => {
  // This is where your "Radar Blips" will eventually come from
  res.json([{ id: 1, name: "Project Alpha", distance: 100, velocity: 2 }]);
});

app.listen(PORT, () => {
  console.log(`Aegis Radar Server active on port ${PORT}`);
});