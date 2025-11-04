// App.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Type Definitions
interface Todo {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

interface Theme {
  background: string;
  cardBackground: string;
  primary: string;
  primaryLight: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  danger: string;
  inputBackground: string;
  headerGradient: string[];
}

interface FormData {
  title: string;
  description: string;
  dueDate: string;
}

interface UseTodosReturn {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  addTodo: (todo: Omit<Todo, '_id' | 'completed' | 'createdAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  clearCompleted: () => void;
}

// Theme definitions
const themes: { light: Theme; dark: Theme } = {
  light: {
    background: '#f5f5f5',
    cardBackground: '#ffffff',
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    danger: '#ef4444',
    inputBackground: '#ffffff',
    headerGradient: ['#7c3aed', '#a78bfa'],
  },
  dark: {
    background: '#111827',
    cardBackground: '#1f2937',
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151',
    success: '#10b981',
    danger: '#ef4444',
    inputBackground: '#374151',
    headerGradient: ['#5b21b6', '#7c3aed'],
  },
};

// Custom hook for managing todos
const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      _id: '1',
      title: 'Complete online JavaScript course',
      description: 'Finish modules 5-8',
      dueDate: new Date('2024-11-10').toISOString(),
      completed: true,
      createdAt: new Date('2024-11-01').toISOString(),
    },
    {
      _id: '2',
      title: 'Jog around the park 3x',
      description: 'Morning exercise routine',
      dueDate: new Date('2024-11-05').toISOString(),
      completed: false,
      createdAt: new Date('2024-11-02').toISOString(),
    },
    {
      _id: '3',
      title: '10 minutes meditation',
      description: 'Mindfulness practice',
      dueDate: new Date('2024-11-04').toISOString(),
      completed: false,
      createdAt: new Date('2024-11-03').toISOString(),
    },
    {
      _id: '4',
      title: 'Read for 1 hour',
      description: 'Continue reading current book',
      dueDate: new Date('2024-11-06').toISOString(),
      completed: false,
      createdAt: new Date('2024-11-03').toISOString(),
    },
    {
      _id: '5',
      title: 'Pick up groceries',
      description: 'Weekly shopping list',
      dueDate: new Date('2024-11-05').toISOString(),
      completed: false,
      createdAt: new Date('2024-11-04').toISOString(),
    },
    {
      _id: '6',
      title: 'Complete Todo App on Frontend Mentor',
      description: 'Build with React Native',
      dueDate: new Date('2024-11-07').toISOString(),
      completed: false,
      createdAt: new Date('2024-11-04').toISOString(),
    },
  ]);

  const addTodo = (todo: Omit<Todo, '_id' | 'completed' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todo,
      _id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo._id === id ? { ...todo, ...updates } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo._id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return { todos, setTodos, addTodo, updateTodo, deleteTodo, toggleComplete, clearCompleted };
};

export default function TodoApp() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
  });
  const [themeAnim] = useState(new Animated.Value(0));

  const { todos, setTodos, addTodo, updateTodo, deleteTodo, toggleComplete, clearCompleted } =
    useTodos();

  const theme = isDark ? themes.dark : themes.light;

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    Animated.timing(themeAnim, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    saveThemePreference();
  }, [isDark]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);

    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (editingTodo) {
      updateTodo(editingTodo._id, formData);
    } else {
      addTodo(formData);
    }

    setModalVisible(false);
    setEditingTodo(null);
    setFormData({ title: '', description: '', dueDate: new Date().toISOString() });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      dueDate: todo.dueDate || new Date().toISOString(),
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingTodo(null);
    setFormData({ title: '', description: '', dueDate: new Date().toISOString() });
  };

  const renderTodoItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.todoItem,
          { 
            backgroundColor: theme.cardBackground, 
            borderColor: theme.border,
            opacity: isActive ? 0.7 : 1,
            transform: [{ scale: isActive ? 1.05 : 1 }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleComplete(item._id)}
          style={styles.checkbox}
          accessibilityLabel={`Mark ${item.title} as ${
            item.completed ? 'incomplete' : 'complete'
          }`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.completed }}
        >
          <View
            style={[
              styles.checkboxInner,
              item.completed && styles.checkboxChecked,
              { borderColor: theme.border },
            ]}
          >
            {item.completed && (
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.todoContent}>
          <Text
            style={[
              styles.todoTitle,
              { color: theme.text },
              item.completed && styles.completedText,
            ]}
          >
            {item.title}
          </Text>
          {item.description && (
            <Text
              style={[
                styles.todoDescription,
                { color: theme.textSecondary },
                item.completed && styles.completedText,
              ]}
            >
              {item.description}
            </Text>
          )}
        </View>

        <View style={styles.todoActions}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.actionButton}
            accessibilityLabel={`Edit ${item.title}`}
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteTodo(item._id)}
            style={styles.actionButton}
            accessibilityLabel={`Delete ${item.title}`}
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (  
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.primary}
        />

        {/* Header */}
         <ImageBackground source={require('./assets/hero.jpg')} style={styles.backgroundImage}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>TODO</Text>
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.themeButton}
              accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              accessibilityRole="button"
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={24}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
          </View>
          </ImageBackground>

        {/* Add Todo Input */}
        <View style={styles.addTodoContainer}>
          <TouchableOpacity
            style={[
              styles.addTodoInput,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Create a new todo"
            accessibilityRole="button"
          >
            <View style={styles.addTodoCircle} />
            <Text style={[styles.addTodoText, { color: theme.textSecondary }]}>
              Create a new todo...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Todo List */}
        <View style={styles.listContainer}>
          {filteredTodos.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={64}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {searchQuery
                  ? 'No todos match your search'
                  : filter === 'completed'
                  ? 'No completed todos'
                  : filter === 'active'
                  ? 'No active todos'
                  : 'No todos yet. Create one to get started!'}
              </Text>
            </View>
          ) : (
            <DraggableFlatList
              data={filteredTodos}
              renderItem={renderTodoItem}
              keyExtractor={(item) => item._id}
              onDragEnd={({ data }) => {
                // Update the original todos array with the new order
                const updatedTodos = [...todos];
                filteredTodos.forEach((filteredTodo, index) => {
                  const originalIndex = updatedTodos.findIndex(t => t._id === filteredTodo._id);
                  const newTodo = data[index];
                  if (originalIndex !== -1 && newTodo) {
                    updatedTodos[originalIndex] = newTodo;
                  }
                });
                
                // If no filters are applied, directly use the reordered data
                if (filter === 'all' && !searchQuery) {
                  setTodos(data);
                }
              }}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
          </Text>
          <TouchableOpacity
            onPress={clearCompleted}
            accessibilityLabel="Clear completed todos"
            accessibilityRole="button"
          >
            <Text style={[styles.footerButton, { color: theme.textSecondary }]}>
              Clear Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View
          style={[
            styles.filterContainer,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          {(['all', 'active', 'completed'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterButton,
                filter === f && { backgroundColor: theme.primary },
              ]}
              accessibilityLabel={`Show ${f} todos`}
              accessibilityRole="tab"
              accessibilityState={{ selected: filter === f }}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === f ? '#ffffff' : theme.text },
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Drag Hint */}
        <Text style={[styles.dragHint, { color: theme.textSecondary }]}>
          Long press and drag to reorder list
        </Text>

        {/* Add/Edit Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <TouchableOpacity
              style={styles.modalBackground}
              activeOpacity={1}
              onPress={handleCancel}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}
                onPress={(e) => e.stopPropagation()}
              >
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {editingTodo ? 'Edit Todo' : 'Create New Todo'}
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="Title *"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  accessibilityLabel="Todo title"
                />

                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="Description"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  multiline
                  numberOfLines={4}
                  accessibilityLabel="Todo description"
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: theme.border }]}
                    onPress={handleCancel}
                    accessibilityLabel="Cancel"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.modalButtonText, { color: theme.text }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.submitButton,
                      { backgroundColor: theme.primary },
                    ]}
                    onPress={handleSubmit}
                    accessibilityLabel={editingTodo ? 'Save changes' : 'Create todo'}
                    accessibilityRole="button"
                  >
                    <Text style={styles.modalButtonText}>
                      {editingTodo ? 'Save' : 'Create'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    height: 250,
  },
   backgroundImage: {
    resizeMode: 'cover',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 8,
  },
  themeButton: {
    padding: 8,
  },
  addTodoContainer: {
    paddingHorizontal: 20,
    marginTop: -100,
  },
  addTodoInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  addTodoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  addTodoText: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 24,
    marginHorizontal: 20,
  },
  listContent: {
    // paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16, 
    borderWidth: 1, 
    gap: 12,
    borderRadius: 8,
  },
  checkbox: {
    padding: 4,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  todoDescription: {
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  todoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  footerText: {
    fontSize: 14,
  },
  footerButton: {
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    // color:"#3A7CFD,"
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dragHint: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {},
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});