import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import Number from '../components/Number';
import Card from '../components/Card';
import DefaultStyles from '../constants/default-styles';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.ceil(max);

  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};

const Game = ({ userChoice, onGameOver }) => {
  const [currentGuess, setCurrentGuess] = useState(
    generateRandomBetween(1, 100, userChoice)
  );
  const [rounds, setRounds] = useState(0);
  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  useEffect(() => {
    if (currentGuess === userChoice) {
      onGameOver(rounds);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = (isLower) => {
    if (
      (isLower && currentGuess < userChoice) ||
      (!isLower && currentGuess > userChoice)
    ) {
      Alert.alert("Don't lie!", 'You know that this is wrong...', [
        { text: 'Sorry', style: 'cancel' },
      ]);

      return;
    }

    if (isLower) {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess;
    }

    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );

    setCurrentGuess(nextNumber);
    setRounds((curRounds) => curRounds + 1);
  };

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.title}>Opponent's Guess</Text>
      <Number>{currentGuess}</Number>
      <Card style={styles.buttonContainer}>
        <Button title='LOWER' onPress={() => nextGuessHandler(true)} />
        <Button title='GREATER' onPress={() => nextGuessHandler(false)} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: 300,
    maxWidth: '80%',
  },
});

export default Game;
