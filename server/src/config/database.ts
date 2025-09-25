import fs from "fs";
import path from "path";

interface Database {
  users: any[];
  patients: any[];
  appointments: any[];
  medical_records: any[];
  notifications: any[];
  anamneses: any[];
  odontograms: any[];
}

let db: Database | null = null;
let dbPath: string;

export const createConnection = (): Database => {
  if (db) {
    return db;
  }

  const databaseDir = path.join(__dirname, "../../database");
  dbPath = path.join(databaseDir, "clinic.json");

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
  }

  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf8");
      db = JSON.parse(data);
      // Ensure anamneses property exists
      if (!db.anamneses) {
        db.anamneses = [];
        saveDatabase(); // Save the updated structure
      }
    } else {
      db = {
        users: [],
        patients: [],
        appointments: [],
        medical_records: [],
        notifications: [],
        anamneses: [],
        odontograms: [],
      };
      saveDatabase();
    }

    console.log("✅ JSON database connected successfully");
    return db!;
  } catch (error) {
    console.error("❌ JSON database connection failed:", error);
    throw error;
  }
};

const saveDatabase = (): void => {
  if (db && dbPath) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
};

export const closeConnection = (): void => {
  if (db) {
    saveDatabase();
    db = null;
    console.log("📪 Database connection closed");
  }
};

const generateId = (table: string): number => {
  if (!db) return 1;
  const records = (db as any)[table] || [];
  return records.length > 0
    ? Math.max(...records.map((r: any) => r.id || 0)) + 1
    : 1;
};

export const executeQuery = <T = any>(
  query: string,
  params: any[] = []
): T[] => {
  if (!db) {
    db = createConnection();
  }

  if (!db) return [];

  try {
    const trimmedQuery = query.trim().toUpperCase();

    // Simple query parser for JSON database
    if (trimmedQuery.startsWith("SELECT")) {
      // Parse table name (very basic)
      const tableMatch = query.match(/FROM\s+(\w+)/i);
      if (!tableMatch || !tableMatch[1]) return [];

      const tableName = tableMatch[1].toLowerCase();
      let records = (db as any)[tableName] || [];

      // Basic WHERE clause support
      const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
      if (whereMatch && whereMatch[1] && params.length > 0) {
        const condition = whereMatch[1];
        if (condition && condition.includes("id = ?")) {
          records = records.filter((r: any) => r.id === params[0]);
        } else if (condition && condition.includes("email = ?")) {
          records = records.filter((r: any) => r.email === params[0]);
        } else if (condition && condition.includes("cpf = ?")) {
          records = records.filter((r: any) => r.cpf === params[0]);
        }
      }

      return records as T[];
    } else if (trimmedQuery.startsWith("INSERT")) {
      const tableMatch = query.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)/i); // Match table and columns
      if (!tableMatch || !tableMatch[1] || !tableMatch[2]) return [];

      const tableName = tableMatch[1].toLowerCase();
      const columns = tableMatch[2].split(",").map((c) => c.trim());

      const newRecord: any = { id: generateId(tableName) };

      columns.forEach((col, index) => {
        newRecord[col] = params[index]; // Directly map parameter to column
      });

      (db as any)[tableName].push(newRecord);
      saveDatabase();

      return [{ lastID: newRecord.id, changes: 1 } as any];
    } else if (trimmedQuery.startsWith("UPDATE")) {
      const tableMatch = query.match(/UPDATE\s+(\w+)/i);
      if (!tableMatch || !tableMatch[1]) return [];

      const tableName = tableMatch[1].toLowerCase();
      const records = (db as any)[tableName] || [];

      const whereMatch = query.match(/WHERE\s+id\s*=\s*\?/i);
      if (whereMatch && params.length > 0) {
        const recordIndex = records.findIndex(
          (r: any) => r.id === params[params.length - 1]
        );
        if (recordIndex !== -1) {
          // Simple SET clause parsing
          const setMatch = query.match(/SET\s+(.+?)\s+WHERE/i);
          if (setMatch && setMatch[1]) {
            const setParts = setMatch[1].split(",");
            setParts.forEach((part, index) => {
              const [column] = part.trim().split("=");
              if (column) {
                records[recordIndex][column.trim()] = params[index];
              }
            });
          }
          saveDatabase();
          return [{ changes: 1 } as any];
        }
      }
    } else if (trimmedQuery.startsWith("DELETE")) {
      const tableMatch = query.match(/DELETE\s+FROM\s+(\w+)/i);
      if (!tableMatch || !tableMatch[1]) return [];

      const tableName = tableMatch[1].toLowerCase();
      const records = (db as any)[tableName] || [];

      const whereMatch = query.match(/WHERE\s+id\s*=\s*\?/i);
      if (whereMatch && params.length > 0) {
        const initialLength = records.length;
        (db as any)[tableName] = records.filter((r: any) => r.id !== params[0]);
        const changes = initialLength - (db as any)[tableName].length;
        saveDatabase();
        return [{ changes } as any];
      }
    }

    return [{ success: true } as any];
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};

export const executeQuerySingle = async <T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> => {
  const rows = await executeQuery<T>(query, params); // Adicionado await
  return rows[0] || null;
};

export const executeTransaction = (
  queries: Array<{ query: string; params?: any[] }>
): any[] => {
  const results: any[] = [];
  for (const { query, params = [] } of queries) {
    const result = executeQuery(query, params);
    results.push(result[0] || { success: true });
  }
  saveDatabase();
  return results;
};
