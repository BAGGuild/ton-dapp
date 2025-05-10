const pool = require('./db');

async function initTasksTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        image_url VARCHAR(255),
        action_url VARCHAR(255),
        reward INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const initialTasks = [
      {
        name: 'Follow BAG Guild on Twitter',
        description: 'Follow us on Twitter',
        type: 'social',
        image_url: null,
        action_url: 'https://x.com/BagGuild',
        reward: 200
      },
      {
        name: 'Join BAG Guild Discord',
        description: 'Join our Discord server',
        type: 'social',
        image_url: null,
        action_url: 'https://discord.gg/BagGuild',
        reward: 200
      },
      {
        name: 'Join BAG Guild Telegram',
        description: 'Join our Telegram channel',
        type: 'social',
        image_url: null,
        action_url: 'https://t.me/BAGGUILD',
        reward: 200
      }
    ];

    for (const task of initialTasks) {
      await pool.query(
        'INSERT INTO tasks (name, description, type, image_url, action_url, reward) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
        [task.name, task.description, task.type, task.image_url, task.action_url, task.reward]
      );
    }

    console.log('Tasks table initialized successfully');
  } catch (error) {
    console.error('Error initializing tasks table:', error);
  }
}

module.exports = initTasksTable; 