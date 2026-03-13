import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

interface Quote {
  id: string;
  text: string;
  author: string;
}

export default function Index() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const savedQuotes = await AsyncStorage.getItem('quotes');
      if (savedQuotes) {
        setQuotes(JSON.parse(savedQuotes));
      }
    } catch (e) {
      console.error('Failed to load quotes', e);
    }
  };

  const saveQuotes = async (newQuotes: Quote[]) => {
    try {
      await AsyncStorage.setItem('quotes', JSON.stringify(newQuotes));
    } catch (e) {
      console.error('Failed to save quotes', e);
    }
  };

  const addQuote = () => {
    if (quote.trim() === '') {
      Alert.alert('Error', 'Please enter a quote');
      return;
    }

    const newQuote: Quote = {
      id: Date.now().toString(),
      text: quote,
      author: author.trim() === '' ? 'Unknown' : author,
    };

    const updatedQuotes = [newQuote, ...quotes];
    setQuotes(updatedQuotes);
    saveQuotes(updatedQuotes);
    setQuote('');
    setAuthor('');
  };

  const deleteQuote = (id: string) => {
    const updatedQuotes = quotes.filter((q) => q.id !== id);
    setQuotes(updatedQuotes);
    saveQuotes(updatedQuotes);
  };

  const renderItem = ({ item }: { item: Quote }) => (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>"{item.text}"</Text>
      <Text style={styles.authorText}>- {item.author}</Text>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => deleteQuote(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>My Favorite Quotes</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a quote..."
          value={quote}
          onChangeText={setQuote}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Author (optional)"
          value={author}
          onChangeText={setAuthor}
        />
        <TouchableOpacity style={styles.addButton} onPress={addQuote}>
          <Text style={styles.addButtonText}>Add Quote</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No quotes added yet. Add your first one!</Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quoteCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 10,
  },
  authorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginBottom: 10,
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});
