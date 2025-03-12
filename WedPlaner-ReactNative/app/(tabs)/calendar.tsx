import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../../components/Navbar';

const { width } = Dimensions.get('window');

interface Task {
  id: number;
  text: string;
  status: string;
  date: Date;
  cost: number;
}

interface CostHistoryItem {
  text: string;
  cost: number;
}

const Calendar = () => {
  const today = new Date();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [costHistory, setCostHistory] = useState<CostHistoryItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(20000);
  const [newTask, setNewTask] = useState('');
  const [newCost, setNewCost] = useState('');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showCostHistory, setShowCostHistory] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [warning, setWarning] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const loadData = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const savedCostHistory = await AsyncStorage.getItem('costHistory');
      const savedBudget = await AsyncStorage.getItem('totalBudget');

      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedCostHistory) setCostHistory(JSON.parse(savedCostHistory));
      if (savedBudget) setTotalBudget(parseFloat(savedBudget));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      await AsyncStorage.setItem('costHistory', JSON.stringify(costHistory));
      await AsyncStorage.setItem('totalBudget', totalBudget.toString());
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveData();
  }, [tasks, costHistory, totalBudget]);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const cost = parseFloat(newCost) || 0;
      if (cost > totalBudget) {
        setWarning('Cost exceeds budget');
        return;
      }

      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        status: 'pending',
        date: selectedDate,
        cost
      };

      setTasks([...tasks, newTaskObj]);
      if (cost > 0) {
        setCostHistory([...costHistory, { text: newTask, cost }]);
        setTotalBudget(totalBudget - cost);
      }
      setNewTask('');
      setNewCost('');
      setWarning('');
    }
  };

  const handleDeleteTask = (id: number) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete) {
      if (taskToDelete.cost > 0) {
        setTotalBudget(totalBudget + taskToDelete.cost);
        setCostHistory(costHistory.filter(item => item.text !== taskToDelete.text));
      }
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleSetBudget = () => {
    const budget = parseFloat(newBudget);
    if (!isNaN(budget)) {
      setTotalBudget(budget);
      setNewBudget('');
      setWarning('');
    }
  };

  const handleEditTask = (taskId: number, text: string) => {
    setEditingTask(taskId);
    setEditingText(text);
  };

  const handleSaveEdit = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.cost > 0) {
      setCostHistory(costHistory.map(item => 
        item.text === task.text ? { ...item, text: editingText } : item
      ));
    }
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, text: editingText } : task
    ));
    setEditingTask(null);
    setEditingText('');
  };

  const toggleTaskCompletion = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (date: Date) => {
    setDragOverDate(date);
  };

  const handleDrop = (date: Date) => {
    if (draggedTask) {
      setTasks(tasks.map(task => 
        task.id === draggedTask.id ? { ...task, date } : task
      ));
      setDraggedTask(null);
      setDragOverDate(null);
    }
  };

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
    const days = [];

    // Adăugăm celule goale pentru zilele de dinainte de prima zi a lunii
    // Nu mai trebuie să ajustăm firstDayOfMonth deoarece Duminica este deja 0
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <View 
          key={`empty-${i}`} 
          style={[styles.calendarDay, { backgroundColor: 'transparent' }]} 
        />
      );
    }

    // Adăugăm zilele lunii
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.calendarDay,
            isToday && styles.currentDay,
            isSelected && styles.selectedDay,
            date.toDateString() === dragOverDate?.toDateString() && styles.dragOver
          ]}
          onPress={() => setSelectedDate(date)}
          onPressIn={() => handleDragOver(date)}
          onPressOut={() => draggedTask && handleDrop(date)}
        >
          <Text style={[
            styles.calendarDayText,
            (isToday || isSelected) && styles.selectedDayText
          ]}>{i}</Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <ImageBackground 
      source={require('../../assets/Img_fundal.jpeg')}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(248, 244, 244, 0.8)', 'rgba(230, 213, 213, 0.8)']}
        style={styles.container}
      >
        <Navbar />
        <View style={styles.mainContent}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.calendarContainer}>
              <Image 
                source={require('../../assets/wedding_bouquet2.jpg')}
                style={styles.bouquetImage}
              />
              <View style={styles.header}>
                <TouchableOpacity onPress={handlePrevMonth}>
                  <FontAwesome name="chevron-left" size={24} color="#6d4c41" />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                  {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                </Text>
                <TouchableOpacity onPress={handleNextMonth}>
                  <FontAwesome name="chevron-right" size={24} color="#6d4c41" />
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa'].map(day => (
                  <Text key={day} style={styles.weekDay}>{day}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {renderCalendar()}
              </View>
            </View>

            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={100}
            >
              <View style={styles.tasksContainer}>
                <Text style={styles.title}>Tasks for {selectedDate.toDateString()}</Text>
                <ScrollView style={styles.tasksList}>
                  {tasks
                    .filter(task => new Date(task.date).toDateString() === selectedDate.toDateString())
                    .map(task => (
                      <View key={task.id} style={[
                        styles.taskItem,
                        completedTasks.includes(task.id) && styles.completedTask
                      ]}>
                        <TouchableOpacity 
                          onPressIn={() => handleDragStart(task)}
                          style={styles.dragHandle}
                        >
                          <FontAwesome name="arrow-right" size={18} color="#6d4c41" />
                        </TouchableOpacity>
                        {editingTask === task.id ? (
                          <TextInput
                            style={styles.editInput}
                            value={editingText}
                            onChangeText={setEditingText}
                            autoFocus
                          />
                        ) : (
                          <Text style={[
                            styles.taskText,
                            completedTasks.includes(task.id) && styles.completedTaskText
                          ]}>{task.text}</Text>
                        )}
                        <View style={styles.taskActions}>
                          {editingTask === task.id ? (
                            <TouchableOpacity onPress={() => handleSaveEdit(task.id)}>
                              <FontAwesome name="check" size={20} color="#4CAF50" />
                            </TouchableOpacity>
                          ) : (
                            <>
                              <TouchableOpacity onPress={() => handleEditTask(task.id, task.text)}>
                                <FontAwesome name="edit" size={20} color="#6d4c41" />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)}>
                                <FontAwesome 
                                  name={completedTasks.includes(task.id) ? "check-circle" : "circle-o"} 
                                  size={20} 
                                  color={completedTasks.includes(task.id) ? "#4CAF50" : "#6d4c41"} 
                                />
                              </TouchableOpacity>
                            </>
                          )}
                          <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                            <FontAwesome name="trash" size={20} color="#6d4c41" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                </ScrollView>

                <View style={styles.addTaskContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="New task"
                    value={newTask}
                    onChangeText={setNewTask}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Cost"
                    value={newCost}
                    onChangeText={setNewCost}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Text style={styles.addButtonText}>Add Task</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.costButton,
                  isKeyboardVisible && { display: 'none' }
                ]}
                onPress={() => setShowCostModal(true)}
              >
                <FontAwesome name="money" size={20} color="#6d4c41" style={styles.costIcon} />
                <Text style={styles.costButtonText}>Cost Management</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>

        <Modal
          visible={showCostModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCostModal(false)}
              >
                <FontAwesome name="times" size={24} color="#6d4c41" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Cost Management</Text>
              <Text style={styles.budgetText}>Total Budget: ${totalBudget.toFixed(2)}</Text>

              <TextInput
                style={styles.input}
                placeholder="Set New Budget"
                value={newBudget}
                onChangeText={setNewBudget}
                keyboardType="numeric"
              />

              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleSetBudget}
              >
                <Text style={styles.modalButtonText}>Set Budget</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowCostHistory(!showCostHistory)}
              >
                <Text style={styles.modalButtonText}>
                  {showCostHistory ? 'Hide Cost History' : 'View Cost History'}
                </Text>
              </TouchableOpacity>

              {showCostHistory && (
                <View style={styles.costHistory}>
                  {costHistory.map((item, index) => (
                    <Text key={index} style={styles.costHistoryItem}>
                      {item.text}: ${item.cost.toFixed(2)}
                    </Text>
                  ))}
                </View>
              )}

              {warning ? <Text style={styles.warning}>{warning}</Text> : null}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 110,
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    marginTop: -14,
    width: 400,
    transform: [{ scale: 0.8 }],
  },
  bouquetImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6d4c41',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: width / 7 - 8,
    textAlign: 'center',
    color: '#6d4c41',
    fontWeight: 'bold',
    fontSize: 13,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: width / 7 - 8,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  calendarDayText: {
    color: '#6d4c41',
    fontSize: 13,
  },
  currentDay: {
    backgroundColor: 'rgba(255, 20, 147, 0.5)',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
  },
  tasksContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    marginTop: -25,
    marginHorizontal: 20,
    marginBottom: 60,
    minHeight: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6d4c41',
    marginBottom: 5,
  },
  tasksList: {
    maxHeight: 300,
    marginBottom: 0,
    marginTop: 0,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    marginBottom: 3,
  },
  taskText: {
    flex: 1,
    color: '#6d4c41',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  addTaskContainer: {
    marginTop: 5,
    paddingBottom: 0,
  },
  input: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    marginBottom: 8,
    height: 40,
  },
  addButton: {
    backgroundColor: '#6d4c41',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  costButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: -40,
    marginBottom: 10,
  },
  costIcon: {
    marginRight: 8,
  },
  costButtonText: {
    color: '#6d4c41',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6d4c41',
    marginBottom: 15,
  },
  budgetText: {
    fontSize: 16,
    color: '#6d4c41',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#6d4c41',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  costHistory: {
    maxHeight: 200,
    marginTop: 10,
  },
  costHistoryItem: {
    padding: 5,
    color: '#6d4c41',
  },
  warning: {
    color: 'red',
    marginTop: 10,
  },
  editInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    color: '#6d4c41',
  },
  completedTask: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  dragHandle: {
    padding: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragOver: {
    backgroundColor: 'rgba(109, 76, 65, 0.2)',
  },
});

export default Calendar; 