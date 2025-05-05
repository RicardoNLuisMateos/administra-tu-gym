import * as SQLite from 'expo-sqlite';

const initializeDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('gym.db');

  // Crear todas las tablas usando execAsync
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS organization (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo TEXT,
      active BOOLEAN DEFAULT 1,
      create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_time DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS member (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      organization_id INTEGER,
      active BOOLEAN DEFAULT 1,
      create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organization (id)
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      time INTEGER NOT NULL,
      active BOOLEAN DEFAULT 1,
      create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organization (id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER,
      plan_id INTEGER,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      active BOOLEAN DEFAULT 1,
      create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (member_id) REFERENCES member (id),
      FOREIGN KEY (plan_id) REFERENCES plans (id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscription_id INTEGER,
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      active BOOLEAN DEFAULT 1,
      create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subscription_id) REFERENCES subscriptions (id)
    );
  `);

  return db;
};

// Exportar una instancia singleton de la base de datos
let database: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async () => {
  if (!database) {
    database = await initializeDatabase();
    
    // Insertar organización por defecto si no existe
    const orgs = await database.getAllAsync('SELECT * FROM organization');
    if (orgs.length === 0) {
      await database.runAsync(
        'INSERT INTO organization (name) VALUES (?)',
        ['Mi Gimnasio']
      );
      
      // Obtener el ID de la organización recién creada
      const org = await database.getAllAsync('SELECT id, name FROM organization LIMIT 1');
      console.log("Organizacion: ", org)
      const orgId = org[0].id;
      
    } else {
      console.log("Organizacion ya existe")
      // Obtener el ID de la organización recién creada
      const org = await database.getAllAsync('SELECT * FROM organization LIMIT 1');
      console.log("Organizacion: ", org)
      console.log("***************************************************")
      const plans = await database.getAllAsync('SELECT * FROM plans');
      console.log("Planes: ", plans)
      console.log("*************************************************** WITH JOINs")
      const members = await database.getAllAsync('SELECT s.id suscription_id, s.member_id, s.plan_id, m.name FROM member m INNER JOIN subscriptions s ON m.id = s.member_id');
      console.log("member: ", members)
    }
  }
  return database;
};

// Ejemplos de operaciones con la base de datos
export const databaseOperations = {
  // Operaciones para Organization
  organization: {
    create: async (name: string, logo?: string) => {
      const db = await getDatabase();
      const result = await db.runAsync(
        'INSERT INTO organization (name, logo) VALUES (?, ?)',
        [name, logo]
      );
      return result;
    },
    getAll: async () => {
      const db = await getDatabase();
      return await db.getAllAsync('SELECT * FROM organization');
    }
  },

  // Operaciones para Member
  member: {
    create: async (name: string, organizationId: number) => {
      console.log("organizationId: ", organizationId)
      console.log("name: ", name)
      const db = await getDatabase();
      const result = await db.runAsync(
        'INSERT INTO member (name, organization_id) VALUES (?, ?)',
        [name, organizationId]
      );
      return result;
    },
    getAll: async () => {
      const db = await getDatabase();
      return await db.getAllAsync('SELECT * FROM member');
    }
  },

  // Operaciones para Plans
  plans: {
    create: async (name: string, price: number, time: number, organizationId: number) => {
      const db = await getDatabase();
      const result = await db.runAsync(
        'INSERT INTO plans (name, price, time, organization_id) VALUES (?, ?, ?, ?)',
        [name, price, time, organizationId]
      );
      return result;
    },
    getAll: async () => {
      const db = await getDatabase();
      return await db.getAllAsync('SELECT * FROM plans WHERE active = 1');
    },
    update: async (id: number, name: string, price: number, time: number, organizationId: number) => {
      const db = await getDatabase();
      const result = await db.runAsync(
        'UPDATE plans SET name = ?, price = ?, time = ?, organization_id = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?',
        [name, price, time, organizationId, id]
      );
      return result;
    },
    delete: async (id: number) => {
      const db = await getDatabase();
      const result = await db.runAsync(
        'UPDATE plans SET active = 0, update_time = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      return result;
    },
  },
  
  // Operaciones para Subscriptions
  subscriptions: {
    create: async ({ member_id, plan_id }: { member_id: number, plan_id: number }) => {
      const db = await getDatabase();
      await db.runAsync(
        'INSERT INTO subscriptions (member_id, plan_id) VALUES (?, ?)',
        [member_id, plan_id]
      );
      const member = await db.getAllAsync(
        "SELECT s.id suscription_id, s.member_id, s.plan_id, m.name FROM member m INNER JOIN subscriptions s ON m.id = s.member_id WHERE m.id = ?",
        [member_id]
      );
      return member[0];
    }
  },

  // Operaciones para Payments
  payments: {
    create: async ({ subscription_id, amount, payment_date }: { subscription_id: number, amount: number, payment_date: string }) => {
      const db = await getDatabase();
      const result = await db.runAsync(
        'INSERT INTO payments (subscription_id, amount, payment_date) VALUES (?, ?, ?)',
        [subscription_id, amount, payment_date]
      );
      return result;
    }
  }
};