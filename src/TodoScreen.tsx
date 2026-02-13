import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from './todoApi';

const TodoScreen = ({ route }: any) => {
  const currentTab = route.name;

  const [text, setText] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleAddOrUpdate = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter a todo');
      return;
    }

    try {
      if (editId) {
        await updateTodo({ id: editId, title: text });
        setEditId(null);
      } else {
        await addTodo({ title: text, completed: false, userId: 1 });
      }
      setText('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Action failed', error);
    }
  };

  const handleEdit = (item: any) => {
    setText(item.title);
    setEditId(item.id);
  };

  const handleToggleStatus = async (item: any) => {
    try {
      await updateTodo({ id: item.id, completed: !item.completed });
    } catch (error) {
      console.error('Toggle failed', error);
    }
  };

  const getFilteredTodos = () => {
    if (!todos) return [];
    if (currentTab === 'Pending') return todos.filter((todo: any) => !todo.completed);
    if (currentTab === 'Completed') return todos.filter((todo: any) => todo.completed);
    return todos;
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.todoInfo}>
        <Text style={[styles.todoText, item.completed && styles.completedText]}>
          {item.title}
        </Text>
        <Text style={styles.statusText}>
          {item.completed ? 'Done' : 'Pending'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleToggleStatus(item)}
          style={[styles.btn, styles.toggleBtn]}
        >
          <Text style={styles.btnText}>Toggle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={[styles.btn, styles.editBtn]}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteTodo(item.id)}
          style={[styles.btn, styles.deleteBtn]}
        >
          <Text style={styles.btnText}>Del</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentTab !== 'Completed' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter todo..."
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddOrUpdate}>
            <Text style={styles.btnText}>{editId ? 'Update' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : isError ? (
        <Text style={styles.errorText}>Failed to load todos.</Text>
      ) : (
        <FlatList
          data={getFilteredTodos()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  toggleBtn: { backgroundColor: '#2E8B57' },
  editBtn: { backgroundColor: '#FFA500' },
  deleteBtn: { backgroundColor: '#FF6B6B' },
  btnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoInfo: {
    marginBottom: 10,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TodoScreen;