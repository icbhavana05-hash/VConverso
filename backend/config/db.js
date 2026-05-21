const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

let dbType = 'mysql';
let mysqlPool = null;
let sqliteDb = null;

// Load environment variables
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'language_learning_db';
const port = process.env.PORT || 5000;

/**
 * Initialize the Database Adapter
 */
async function initDb() {
  // Check if MySQL connection parameters are provided
  const hasMysqlConfig = process.env.DB_HOST && process.env.DB_USER;

  if (hasMysqlConfig) {
    try {
      console.log(`[Database] Attempting to connect to MySQL at ${dbHost}...`);

      // First, create a connection without database name to ensure the DB exists
      const tempConnection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword
      });

      await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await tempConnection.end();

      // Now create the pool with the database specified
      mysqlPool = mysql.createPool({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Test connection
      const conn = await mysqlPool.getConnection();
      console.log(`[Database] Successfully connected to MySQL database: "${dbName}"`);
      conn.release();

      dbType = 'mysql';

      // Check if tables exist, and seed if they are empty
      await seedMysqlIfEmpty();
      return;
    } catch (err) {
      console.warn(`[Database WARNING] Failed to connect to MySQL: ${err.message}`);
      console.log('[Database] Falling back to SQLite file database for a seamless local development experience.');
    }
  } else {
    console.log('[Database] MySQL environment variables not provided. Using SQLite local fallback.');
  }

  // Fallback to SQLite
  dbType = 'sqlite';
  const dbPath = path.join(__dirname, '..', 'database.sqlite');

  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('[Database ERROR] Could not initialize SQLite database:', err.message);
    } else {
      console.log(`[Database] SQLite database successfully connected at: ${dbPath}`);
    }
  });

  // Enable foreign key constraints in SQLite
  sqliteDb.run('PRAGMA foreign_keys = ON;');

  // Create tables and seed data
  await initSQLiteSchemaAndSeed();
}

/**
 * Run a MySQL query
 */
async function mysqlQuery(sql, params) {
  return await mysqlPool.query(sql, params);
}

/**
 * Run an SQLite query with standard mysql2 format return [rows, fields]
 */
function sqliteQuery(sql, params = []) {
  // Convert standard SQL from MySQL to SQLite if needed
  // SQLite uses ? format just like mysql2, so no changes to query params are needed.
  return new Promise((resolve, reject) => {
    // If the statement is a SELECT, use sqliteDb.all
    const isSelect = sql.trim().toLowerCase().startsWith('select') ||
      sql.trim().toLowerCase().startsWith('pragma') ||
      sql.trim().toLowerCase().startsWith('show');

    if (isSelect) {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) {
          console.error(`[SQLite Error] Query: ${sql} | Error: ${err.message}`);
          reject(err);
        } else {
          resolve([rows, null]);
        }
      });
    } else {
      // Use sqliteDb.run for INSERT, UPDATE, DELETE
      sqliteDb.run(sql, params, function (err) {
        if (err) {
          console.error(`[SQLite Error] Run: ${sql} | Error: ${err.message}`);
          reject(err);
        } else {
          // Map sqlite result to mysql result structure
          const result = {
            insertId: this.lastID,
            affectedRows: this.changes
          };
          resolve([result, null]);
        }
      });
    }
  });
}

/**
 * Seed MySQL if it was just created/empty
 */
async function seedMysqlIfEmpty() {
  try {
    const [rows] = await mysqlPool.query("SHOW TABLES LIKE 'Language'");
    if (rows.length === 0) {
      console.log('[Database] MySQL tables not found. Importing schema and sample data...');

      const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        // Split by semicolon and remove SQL comments
        const statements = schemaSql
          .split(';')
          .map(stmt => stmt.split('\n').filter(line => !line.trim().startsWith('--')).join('\n').trim())
          .filter(stmt => stmt.length > 0);

        for (const statement of statements) {
          if (statement.toLowerCase().startsWith('use')) continue;
          await mysqlPool.query(statement);
        }
        console.log('[Database] MySQL schema imported and seeded successfully.');
      } else {
        console.warn('[Database WARNING] schema.sql not found at ' + schemaPath);
      }
    }
  } catch (err) {
    console.error('[Database ERROR] Error checking/seeding MySQL tables:', err.message);
  }
}

/**
 * Create and Seed SQLite Database
 */
function initSQLiteSchemaAndSeed() {
  return new Promise((resolve) => {
    sqliteDb.serialize(async () => {
      // 1. Create tables
      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS User (
          user_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Language (
          language_id INTEGER PRIMARY KEY AUTOINCREMENT,
          language_name TEXT NOT NULL,
          language_image TEXT NOT NULL,
          description TEXT
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Topics (
          topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
          language_id INTEGER NOT NULL,
          topic_name TEXT NOT NULL,
          topic_description TEXT,
          FOREIGN KEY (language_id) REFERENCES Language(language_id) ON DELETE CASCADE
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Notes (
          note_id INTEGER PRIMARY KEY AUTOINCREMENT,
          topic_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          FOREIGN KEY (topic_id) REFERENCES Topics(topic_id) ON DELETE CASCADE
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Quizzes (
          quiz_id INTEGER PRIMARY KEY AUTOINCREMENT,
          topic_id INTEGER NOT NULL,
          quiz_title TEXT NOT NULL,
          total_marks INTEGER NOT NULL,
          FOREIGN KEY (topic_id) REFERENCES Topics(topic_id) ON DELETE CASCADE
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Qs (
          question_id INTEGER PRIMARY KEY AUTOINCREMENT,
          quiz_id INTEGER NOT NULL,
          question_text TEXT NOT NULL,
          option_a TEXT NOT NULL,
          option_b TEXT NOT NULL,
          option_c TEXT NOT NULL,
          option_d TEXT NOT NULL,
          correct_answer TEXT NOT NULL,
          FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Answers (
          answer_id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          selected_answer TEXT NOT NULL,
          FOREIGN KEY (question_id) REFERENCES Qs(question_id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Attempts (
          attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          quiz_id INTEGER NOT NULL,
          attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          score INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
          FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
        );
      `);

      sqliteDb.run(`
        CREATE TABLE IF NOT EXISTS Scores (
          score_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          language_id INTEGER NOT NULL,
          total_score INTEGER DEFAULT 0,
          progress_percentage REAL DEFAULT 0.0,
          FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
          FOREIGN KEY (language_id) REFERENCES Language(language_id) ON DELETE CASCADE,
          UNIQUE (user_id, language_id)
        );
      `);

      // Check if languages exist
      sqliteDb.get("SELECT COUNT(*) as count FROM Language", [], async (err, row) => {
        if (row && row.count === 0) {
          console.log('[Database] SQLite database empty. Seeding sample language data...');

          const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
          if (fs.existsSync(schemaPath)) {
            // Read lines and execute inserting statements (ignoring creates, use, and tables)
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            const statements = schemaSql
              .split(';')
              .map(stmt => stmt.split('\n').filter(line => !line.trim().startsWith('--')).join('\n').trim())
              .filter(stmt => stmt.length > 0 && stmt.toLowerCase().startsWith('insert'));

            for (const statement of statements) {
              // Convert escaped single quotes if any (schema.sql has double single quotes '' for SQL string escaping, which SQLite also supports)
              sqliteDb.run(statement, (insertErr) => {
                if (insertErr) {
                  console.warn(`[Database WARNING] SQLite seed error: ${insertErr.message} on statement: ${statement}`);
                }
              });
            }
            console.log('[Database] SQLite seeded with languages, topics, notes, and quiz questions.');
          } else {
            console.warn('[Database WARNING] schema.sql not found for SQLite seeding. Seeding manually...');
          }
        }
        resolve();
      });
    });
  });
}

// Wrapper query function that supports standard mysql2 query parameters
async function query(sql, params) {
  if (dbType === 'mysql') {
    return await mysqlQuery(sql, params);
  } else {
    return await sqliteQuery(sql, params);
  }
}

// Export initialization function and query wrapper
module.exports = {
  initDb,
  query,
  getDbType: () => dbType
};
