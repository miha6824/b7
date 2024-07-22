import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Checkbox, Button, Card } from 'react-native-paper';

// Redux slice for todos
const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now().toString(), text: action.payload, completed: false });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload);
    },
  },
});

const { actions, reducer } = todoSlice;
const store = configureStore({ reducer: { todos: reducer } });

// App Component
const TodoList = () => {
  const [text, setText] = useState('');
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if (text.trim().length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung công việc.');
      return;
    }
    dispatch(actions.addTodo(text));
    setText('');
  };

  const handleToggleTodo = (id) => {
    dispatch(actions.toggleTodo(id));
  };

  const handleDeleteTodo = (id) => {
    dispatch(actions.deleteTodo(id));
  };

  const renderTodo = ({ item }) => (
    <Card style={styles.todoItem}>
      <View style={styles.todoContent}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => handleToggleTodo(item.id)}
        />
        <Text style={[styles.todoText, item.completed && styles.completedText]}>
          {item.text}
        </Text>
        <TouchableOpacity onPress={() => handleDeleteTodo(item.id)} style={styles.deleteButtonContainer}>
          <Text style={styles.deleteButton}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Todo List" />
      </Appbar.Header>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập công việc mới"
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
        />
        <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>
          Thêm
        </Button>
      </View>
      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    borderRadius: 8,
  },
  listContainer: {
    padding: 16,
  },
  todoItem: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButtonContainer: {
    marginLeft: 16,
  },
  deleteButton: {
    color: '#ff5252',
    fontWeight: 'bold',
  },
});

export default App;
