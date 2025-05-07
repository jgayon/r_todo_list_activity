import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, TextInput, Dialog, Portal, Button, Provider } from "react-native-paper";

export default function TodoList() {
  const [data, setData] = useState([{ id: 1, name: "Item 1" }]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [editItemId, setEditItemId] = useState(null);

  const addItem = () => {
    const newItem = {
      id: Date.now(), 
      name: `Item ${data.length + 1}`
    };
    setData((prevData) => [...prevData, newItem]);
  };

  const deleteItem = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const openEditDialog = (item) => {
    setCurrentText(item.name);
    setEditItemId(item.id);
    setDialogVisible(true);
  };

  const saveEdit = () => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === editItemId ? { ...item, name: currentText } : item
      )
    );
    setDialogVisible(false);
    setEditItemId(null);
    setCurrentText("");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onLongPress={() =>
        Alert.alert(
          "Opciones",
          "¿Qué deseas hacer?",
          [
            { text: "Editar", onPress: () => openEditDialog(item) },
            { text: "Eliminar", onPress: () => deleteItem(item.id), style: "destructive" },
            { text: "Cancelar", style: "cancel" }
          ],
          { cancelable: true }
        )
      }
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
          />
          <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />

          <Portal>
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
              <Dialog.Title>Editar tarea</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Tarea"
                  value={currentText}
                  onChangeText={setCurrentText}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
                <Button onPress={saveEdit}>Guardar</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 5
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee"
  }
});
