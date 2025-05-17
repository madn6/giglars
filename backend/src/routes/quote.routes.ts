import express from 'express';
import axios from 'axios'

const quoteRouter = express.Router();

quoteRouter.get('/quote', async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random');
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

export default quoteRouter;
