import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Word } from '../models';

const tableName = 'words';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'words-data.db', location: 'default'});
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};

export const createTable = async (db: SQLiteDatabase) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id TEXT NOT NULL,
        hieroglyph TEXT NOT NULL,
        oldHieroglyph TEXT NOT NULL,
        pinyin TEXT NOT NULL,
        wordType TEXT NOT NULL,
        translation TEXT NOT NULL,
        description TEXT NOT NULL,
        weight TEXT NOT NULL,
        creationDate TEXT NOT NULL,
        lastProposalDate TEXT NOT NULL
      );`;
    await db.executeSql(query);
};

export const getWords = async (db: SQLiteDatabase): Promise<Word[]> => {
  //TODO для показа полного словаря
  try {
    const words: Word[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        words.push(result.rows.item(index))
      }
    });
    return words;

  } catch (error) {
    console.error(error);
    throw Error('Failed to get words !!!');
  }
};

export const getWord = async (db: SQLiteDatabase) => {
  //TODO логика выбора слова!!! Умныый селект на основе веса и даты
  const results = await db.executeSql(`SELECT * FROM ${tableName}`);
  return results[0].rows.item(0);
}

export const insertWord = async (db: SQLiteDatabase, word: Word) => {
  const insertQuery =
    `INSERT INTO ${tableName}` +
    `(id, hieroglyph, oldHieroglyph, pinyin, wordType, translation, description, weight, creationDate, lastProposalDate)` +
    `\nVALUES ` +
    `('${word.id}', '${word.hieroglyph}', '${word.oldHieroglyph}', '${word.pinyin}', '${word.wordType}', '${word.translation}', '${word.description}', '${word.weight}', '${word.creationDate.toString()}', '${word.lastProposalDate.toString()}')`

  return db.executeSql(insertQuery);
}

export const updateWord = async (db: SQLiteDatabase, word: Word) => {
  //TODO апдейтим обязательно! вес и дату последнего пропозала, а остальное тоже
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, hieroglyph) \nVALUES ` +
   `('${word.id}', '${word.hieroglyph}')`

  return db.executeSql(insertQuery);
}

export const deleteWord = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};
// using (SqlConnection conn = new SqlConnection(connString))
// {
//     string sql = "SELECT last_insert_rowid()";
//     SqlCommand cmd = new SqlCommand(sql, conn);
//     conn.Open();
//     int lastID = (Int32) cmd.ExecuteScalar();
// }