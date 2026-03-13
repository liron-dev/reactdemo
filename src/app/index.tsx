import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  Clipboard,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Data Schema
interface Empire {
  id: string;
  name: string;
  continent: 'Europe' | 'Asia' | 'Africa' | 'Americas' | 'Oceania';
  government: 'Monarchy' | 'Republic' | 'Caliphate' | 'Empire' | 'Khanate' | 'City-State';
  religion: 'Christianity' | 'Islam' | 'Buddhism' | 'Hinduism' | 'Polytheism' | 'Secular/Other';
  longevity: number; // Years
  area: number; // Million km²
  population: number; // Millions
}

const EMPIRES_DATA: Empire[] = [
  {
    id: "roman-empire",
    name: "Roman Empire",
    continent: "Europe",
    government: "Empire",
    religion: "Polytheism",
    longevity: 1480,
    area: 5.0,
    population: 70,
  },
  {
    id: "british-empire",
    name: "British Empire",
    continent: "Europe",
    government: "Monarchy",
    religion: "Christianity",
    longevity: 400,
    area: 35.5,
    population: 412,
  },
  {
    id: "mongol-empire",
    name: "Mongol Empire",
    continent: "Asia",
    government: "Khanate",
    religion: "Polytheism",
    longevity: 162,
    area: 24.0,
    population: 110,
  },
  {
    id: "ottoman-empire",
    name: "Ottoman Empire",
    continent: "Asia",
    government: "Caliphate",
    religion: "Islam",
    longevity: 624,
    area: 5.2,
    population: 35,
  },
  {
    id: "han-dynasty",
    name: "Han Dynasty",
    continent: "Asia",
    government: "Empire",
    religion: "Buddhism",
    longevity: 426,
    area: 6.5,
    population: 58,
  },
  {
    id: "mali-empire",
    name: "Mali Empire",
    continent: "Africa",
    government: "Monarchy",
    religion: "Islam",
    longevity: 350,
    area: 1.1,
    population: 40,
  },
  {
    id: "inca-empire",
    name: "Inca Empire",
    continent: "Americas",
    government: "Monarchy",
    religion: "Polytheism",
    longevity: 300,
    area: 2.0,
    population: 12,
  },
  {
    id: "qing-dynasty",
    name: "Qing Dynasty",
    continent: "Asia",
    government: "Empire",
    religion: "Buddhism",
    longevity: 268,
    area: 14.7,
    population: 450,
  },
  {
    id: "aztec-empire",
    name: "Aztec Empire",
    continent: "Americas",
    government: "City-State",
    religion: "Polytheism",
    longevity: 191,
    area: 0.22,
    population: 6,
  },
  {
    id: "abbasid-caliphate",
    name: "Abbasid Caliphate",
    continent: "Asia",
    government: "Caliphate",
    religion: "Islam",
    longevity: 508,
    area: 11.1,
    population: 50,
  },
  {
    id: "russian-empire",
    name: "Russian Empire",
    continent: "Europe",
    government: "Empire",
    religion: "Christianity",
    longevity: 196,
    area: 22.8,
    population: 170,
  },
  {
    id: "byzantine-empire",
    name: "Byzantine Empire",
    continent: "Europe",
    government: "Empire",
    religion: "Christianity",
    longevity: 1123,
    area: 3.5,
    population: 26,
  },
  {
    id: "french-colonial-empire",
    name: "French Colonial Empire",
    continent: "Europe",
    government: "Republic",
    religion: "Christianity",
    longevity: 450,
    area: 11.5,
    population: 110,
  },
  {
    id: "spanish-empire",
    name: "Spanish Empire",
    continent: "Europe",
    government: "Monarchy",
    religion: "Christianity",
    longevity: 400,
    area: 13.7,
    population: 68,
  },
  {
    id: "mughal-empire",
    name: "Mughal Empire",
    continent: "Asia",
    government: "Empire",
    religion: "Islam",
    longevity: 331,
    area: 4.0,
    population: 150,
  }
];

const COLORS = {
  correct: '#4caf50',
  incorrect: '#37474f',
  text: '#ffffff',
  background: '#121212',
  surface: '#1e1e1e',
  border: '#333333',
};

export default function Empiredle() {
  const [targetEmpire, setTargetEmpire] = useState<Empire>(EMPIRES_DATA[0]);
  const [guesses, setGuesses] = useState<Empire[]>([]);
  const [inputText, setInputText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    // Pick an empire of the day based on the date
    const today = new Date();
    const index = (today.getFullYear() * 365 + today.getMonth() * 31 + today.getDate()) % EMPIRES_DATA.length;
    setTargetEmpire(EMPIRES_DATA[index]);
  }, []);

  const filteredEmpires = useMemo(() => {
    if (inputText.length === 0) return [];
    return EMPIRES_DATA.filter(
      emp => emp.name.toLowerCase().includes(inputText.toLowerCase()) && 
      !guesses.find(g => g.id === emp.id)
    );
  }, [inputText, guesses]);

  const handleGuess = (empire: Empire) => {
    if (gameWon) return;
    
    const newGuesses = [empire, ...guesses];
    setGuesses(newGuesses);
    setInputText('');
    setShowDropdown(false);

    if (empire.id === targetEmpire.id) {
      setGameWon(true);
    }
  };

  const getNumericalFeedback = (guessVal: number, targetVal: number) => {
    if (guessVal === targetVal) return { color: COLORS.correct, arrow: '' };
    return { color: COLORS.incorrect, arrow: guessVal < targetVal ? '↑' : '↓' };
  };

  const getCategoricalFeedback = (guessVal: string, targetVal: string) => {
    return guessVal === targetVal ? COLORS.correct : COLORS.incorrect;
  };

  const shareResults = () => {
    let resultString = `Empiredle Guess results:\n`;
    const reversedGuesses = [...guesses].reverse();
    reversedGuesses.forEach(g => {
      const row = [
        getCategoricalFeedback(g.continent, targetEmpire.continent) === COLORS.correct ? '🟩' : '⬛',
        getCategoricalFeedback(g.government, targetEmpire.government) === COLORS.correct ? '🟩' : '⬛',
        getCategoricalFeedback(g.religion, targetEmpire.religion) === COLORS.correct ? '🟩' : '⬛',
        getNumericalFeedback(g.longevity, targetEmpire.longevity).color === COLORS.correct ? '🟩' : '⬛',
        getNumericalFeedback(g.area, targetEmpire.area).color === COLORS.correct ? '🟩' : '⬛',
        getNumericalFeedback(g.population, targetEmpire.population).color === COLORS.correct ? '🟩' : '⬛',
      ].join('');
      resultString += row + '\n';
    });
    Clipboard.setString(resultString);
    alert('Copied to clipboard!');
  };

  const renderGuessItem = ({ item }: { item: Empire }) => (
    <View style={styles.guessRow}>
        <Text style={styles.guessName}>{item.name}</Text>
        <View style={styles.cellsContainer}>
            <View style={[styles.cell, { backgroundColor: getCategoricalFeedback(item.continent, targetEmpire.continent) }]}>
                <Text style={styles.cellLabel}>Cont.</Text>
                <Text style={styles.cellValue}>{item.continent}</Text>
            </View>
            <View style={[styles.cell, { backgroundColor: getCategoricalFeedback(item.government, targetEmpire.government) }]}>
                <Text style={styles.cellLabel}>Gov.</Text>
                <Text style={styles.cellValue}>{item.government}</Text>
            </View>
            <View style={[styles.cell, { backgroundColor: getCategoricalFeedback(item.religion, targetEmpire.religion) }]}>
                <Text style={styles.cellLabel}>Rel.</Text>
                <Text style={styles.cellValue}>{item.religion}</Text>
            </View>
            <View style={[styles.cell, { backgroundColor: getNumericalFeedback(item.longevity, targetEmpire.longevity).color }]}>
                <Text style={styles.cellLabel}>Years</Text>
                <Text style={styles.cellValue}>{item.longevity}{getNumericalFeedback(item.longevity, targetEmpire.longevity).arrow}</Text>
            </View>
            <View style={[styles.cell, { backgroundColor: getNumericalFeedback(item.area, targetEmpire.area).color }]}>
                <Text style={styles.cellLabel}>Area</Text>
                <Text style={styles.cellValue}>{item.area}{getNumericalFeedback(item.area, targetEmpire.area).arrow}</Text>
            </View>
            <View style={[styles.cell, { backgroundColor: getNumericalFeedback(item.population, targetEmpire.population).color }]}>
                <Text style={styles.cellLabel}>Pop.</Text>
                <Text style={styles.cellValue}>{item.population}{getNumericalFeedback(item.population, targetEmpire.population).arrow}</Text>
            </View>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>EMPIREDLE</Text>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Guess an empire..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setShowDropdown(text.length > 0);
          }}
          editable={!gameWon}
        />
        {showDropdown && filteredEmpires.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled">
              {filteredEmpires.map((emp) => (
                <TouchableOpacity
                  key={emp.id}
                  style={styles.dropdownItem}
                  onPress={() => handleGuess(emp)}
                >
                  <Text style={styles.dropdownText}>{emp.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <FlatList
        data={guesses}
        keyExtractor={(item) => item.id}
        renderItem={renderGuessItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
            guesses.length > 0 ? (
                <View style={styles.tableHeader}>
                    {/* Add labels if needed, but they are inside cells now */}
                </View>
            ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Start guessing to reveal the empire of the day!</Text>
          </View>
        }
      />

      <Modal visible={gameWon} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>VICTORY!</Text>
            <Text style={styles.modalSubtitle}>The empire was {targetEmpire.name}</Text>
            
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Continent: {targetEmpire.continent}</Text>
                <Text style={styles.summaryText}>Government: {targetEmpire.government}</Text>
                <Text style={styles.summaryText}>Religion: {targetEmpire.religion}</Text>
                <Text style={styles.summaryText}>Longevity: {targetEmpire.longevity} years</Text>
                <Text style={styles.summaryText}>Area: {targetEmpire.area}M km²</Text>
                <Text style={styles.summaryText}>Population: {targetEmpire.population}M</Text>
            </View>

            <TouchableOpacity style={styles.shareButton} onPress={shareResults}>
              <Text style={styles.shareButtonText}>Share Results</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setGameWon(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: COLORS.text,
    letterSpacing: 2,
  },
  inputSection: {
    padding: 20,
    zIndex: 10,
    maxWidth: isWeb ? 600 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: COLORS.surface,
    position: 'absolute',
    top: 75,
    left: 20,
    right: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownText: {
    color: COLORS.text,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 40,
    maxWidth: isWeb ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  guessRow: {
    marginBottom: 15,
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 10,
  },
  guessName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cellsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  cellLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cellValue: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableHeader: {
    height: 10,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.correct,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
  },
  summaryText: {
    color: COLORS.text,
    fontSize: 16,
    marginVertical: 4,
  },
  shareButton: {
    backgroundColor: COLORS.correct,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  shareButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#aaa',
    fontSize: 16,
  },
});
