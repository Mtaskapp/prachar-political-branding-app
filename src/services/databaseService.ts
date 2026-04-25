// Database Service - SQLite for offline storage
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);

const DATABASE_NAME = 'prachar.db';
const DATABASE_VERSION = 1.0;
const DATABASE_DISPLAYNAME = 'Prachar Database';
const DATABASE_SIZE = 200000; // 200KB

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    if (this.db) {
      return;
    }

    try {
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // Users table
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phoneNumber TEXT UNIQUE,
        name TEXT,
        state TEXT,
        constituency TEXT,
        party TEXT,
        isVerified BOOLEAN,
        createdAt DATETIME,
        updatedAt DATETIME
      );`
    );

    // Campaigns table
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        userId TEXT,
        title TEXT,
        description TEXT,
        type TEXT,
        templateId TEXT,
        content TEXT,
        status TEXT,
        createdAt DATETIME,
        updatedAt DATETIME,
        FOREIGN KEY(userId) REFERENCES users(id)
      );`
    );

    // Templates table
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        partyId TEXT,
        templateName TEXT,
        category TEXT,
        thumbnail TEXT,
        content TEXT,
        isOfficial BOOLEAN,
        createdAt DATETIME,
        syncedAt DATETIME
      );`
    );

    // Party Logos table
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS partyLogos (
        id TEXT PRIMARY KEY,
        partyId TEXT,
        logoUrl TEXT,
        slogan TEXT,
        color TEXT,
        createdAt DATETIME
      );`
    );

    // Media files table
    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS mediaFiles (
        id TEXT PRIMARY KEY,
        campaignId TEXT,
        fileType TEXT,
        filePath TEXT,
        size BIGINT,
        duration INTEGER,
        createdAt DATETIME,
        FOREIGN KEY(campaignId) REFERENCES campaigns(id)
      );`
    );
  }

  // Insert user
  async insertUser(user: any): Promise<void> {
    if (!this.db) await this.initDatabase();
    await this.db!.executeSql(
      `INSERT INTO users (id, phoneNumber, name, state, constituency, party, isVerified, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.phoneNumber, user.name, user.state, user.constituency, user.party, user.isVerified || false, new Date().toISOString(), new Date().toISOString()]
    );
  }

  // Get user
  async getUser(userId: string): Promise<any> {
    if (!this.db) await this.initDatabase();
    const results = await this.db!.executeSql(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );
    return results[0]?.rows?.item?.(0) || null;
  }

  // Insert campaign
  async insertCampaign(campaign: any): Promise<void> {
    if (!this.db) await this.initDatabase();
    await this.db!.executeSql(
      `INSERT INTO campaigns (id, userId, title, description, type, templateId, content, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [campaign.id, campaign.userId, campaign.title, campaign.description, campaign.type, campaign.templateId, JSON.stringify(campaign.content), campaign.status || 'draft', new Date().toISOString(), new Date().toISOString()]
    );
  }

  // Get campaigns by user
  async getCampaignsByUser(userId: string): Promise<any[]> {
    if (!this.db) await this.initDatabase();
    const results = await this.db!.executeSql(
      `SELECT * FROM campaigns WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
    const campaigns = [];
    for (let i = 0; i < results[0]?.rows?.length; i++) {
      campaigns.push(results[0].rows.item(i));
    }
    return campaigns;
  }

  // Get templates
  async getTemplates(partyId: string): Promise<any[]> {
    if (!this.db) await this.initDatabase();
    const results = await this.db!.executeSql(
      `SELECT * FROM templates WHERE partyId = ? OR isOfficial = 1`,
      [partyId]
    );
    const templates = [];
    for (let i = 0; i < results[0]?.rows?.length; i++) {
      templates.push(results[0].rows.item(i));
    }
    return templates;
  }

  // Close database
  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export default new DatabaseService();
