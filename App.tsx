/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { WordComponent } from './src/components/Word/WordComponent';
import { Word, Weight } from './src/models';
import { createTable, deleteTable, getDBConnection, getWord, insertWord, updateWord } from './src/services/db-service';
import 'react-native-get-random-values';
import { v4 } from 'uuid'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from 'react-native-elements';

type IFormInput = {
  hieroglyph: string;
  oldHieroglyph: string;
  pinyin: string;
  wordType: string;
  translation: string;
  description: string;
}

const App = () => {
  const [word, setWord] = useState<Word>({} as Word);
  const [isFormVisible, setIsFormVisible] = useState(true);
  // добавить булевое для показа модалки с ответом
  // добавить булевое для показа всего словаря

  const [hieroglyph, setHieroglyph] = useState('');
  const [oldHieroglyph, setOldHieroglyph] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [wordType, setWordType] = useState('');
  const [translation, setTranslation] = useState('');
  const [description, setDescription] = useState('');

  const addWord = async () => {
    try {
      const creationDate = new Date(Date.now());

      const newWord: Word = {
        id: v4().toString(),
        hieroglyph: hieroglyph,
        oldHieroglyph: oldHieroglyph,
        pinyin: pinyin,
        wordType: wordType,
        translation: translation,
        description: description,
        weight: Weight.EIGHT,
        creationDate: creationDate,
        lastProposalDate: creationDate,
      }

      const db = await getDBConnection();
      await insertWord(db, newWord);
      setWord(newWord);
    } catch (error) {
      console.log("🚀 ~ addWord ~ error:", error);
    }
  };

  const onSubmit = async () => {
    setIsFormVisible(!isFormVisible);
    await addWord();
  };
  const onDeleteTable = async () => {
    const db = await getDBConnection();
    await deleteTable(db);
  };

  const answer = async (id: string) => {
    //TODO показываем правильный ответ
    //TODO показываем модалку правильно-неправильно, на основании
    // правильности скорости ответа выставляем
    // вес слова, апдейтим слово в базе
    console.log("🚀 ~ answer ~ id:", id)
    setIsFormVisible(!isFormVisible);
  };

  
  const initDB = async () => {
    const db = await getDBConnection();
    await createTable(db)
  };
  const getStartWord = async () => {
    const db = await getDBConnection();
    const wordFromDB = await getWord(db);
    wordFromDB ? setWord(wordFromDB) : setWord({} as Word)
  };

  useEffect(() => {
    initDB();
    getStartWord();
  }, []);
  
  //TODO условный рендер модалки
  //TODO условный рендер всего словаря
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.textInputContainer}>

          <View style={[styles.appTitleView]}>
            <Text style={styles.appTitleText}> MemoryHelper </Text>
          </View>

          <View onTouchEnd={() => answer(word.id)}>
            <WordComponent key={word.id} word={word} />
          </View>

          <View>
            {isFormVisible ? (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder='hieroglyph'
                  onChangeText={newText => setHieroglyph(newText)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='oldHieroglyph'
                  onChangeText={newText => setOldHieroglyph(newText)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='pinyin'
                  onChangeText={newText => setPinyin(newText)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='wordType'
                  onChangeText={newText => setWordType(newText)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='translation'
                  onChangeText={newText => setTranslation(newText)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='description'
                  onChangeText={newText => setDescription(newText)}
                />

                <Button title='Add word' onPress={() => onSubmit()}/> 
              </View>
            ) : null}
          </View>
        </View>
        <Button title='Drop table' onPress={() => onDeleteTable()}/> 

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appTitleView: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800'
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end'
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 100,
    margin: 10,
    fontSize: 48,
    backgroundColor: 'pink'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;