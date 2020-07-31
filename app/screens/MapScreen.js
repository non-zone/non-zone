import * as React from 'react';
import { StyleSheet, Text} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function ShowStoryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text>Map screen</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
