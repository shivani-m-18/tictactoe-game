const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);


async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

connectDB();


const db = client.db('tictactoe');
const playersCollection = db.collection('players');


app.post('/api/players', async (req, res) => {
  const { player1, player2 } = req.body;
  console.log('Received data:', { player1, player2 });

  
  const player1Data = {
    name: player1.name,
    symbol: player1.symbol,
    matchesPlayed: 1, 
    matchesWon: 0,    
  };

  
  const player2Data = {
    name: player2.name,
    symbol: player2.symbol,
    matchesPlayed: 1,
    matchesWon: 0,
  };

  try {
    
    const existingPlayer1 = await playersCollection.findOne({ name: player1.name });
    if (existingPlayer1) {
      await playersCollection.updateOne(
        { name: player1.name },
        {
          $inc: { matchesPlayed: 1 },
          $set: { symbol: player1.symbol },
        }
      );
    } else {
      await playersCollection.insertOne(player1Data);
    }

    
    const existingPlayer2 = await playersCollection.findOne({ name: player2.name });
    if (existingPlayer2) {
      await playersCollection.updateOne(
        { name: player2.name },
        {
          $inc: { matchesPlayed: 1 },
          $set: { symbol: player2.symbol },
        }
      );
    } else {
      await playersCollection.insertOne(player2Data);
    }

    res.json({
      message: 'Players data processed successfully',
      player1: player1.name,
      symbol1: player1.symbol,
      player2: player2.name,
      symbol2: player2.symbol,
    });
  } catch (error) {
    console.error('Error processing players:', error);
    res.status(500).json({ error: 'Failed to process players' });
  }
});


app.get('/api/players', async (req, res) => {
  try {
    const players = await playersCollection.find().toArray(); 
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players stats' });
  }
});


app.post('/api/players/win', async (req, res) => {
  const { winnerName } = req.body;

  try {
    const result = await playersCollection.updateOne(
      { name: winnerName },
      { $inc: { matchesWon: 1 } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: `Player ${winnerName} not found` });
    }

    res.json({ message: `Matches won updated for ${winnerName}` });
  } catch (error) {
    console.error('Error updating matches won:', error);
    res.status(500).json({ error: 'Failed to update matches won' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
