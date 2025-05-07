import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from "react-native";
import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Appbar,
  Menu
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function TodoList() {
  const [visible, setVisible] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [data, setData] = useState([{ id: 1, name: "Item 1" }]);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const openMenu = (id) => setMenuVisibleId(id);
  const closeMenu = () => setMenuVisibleId(null);

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.rightAction}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </View>
    );

    return (
      <Swipeable
        friction={2}
        overshootRight={false}
        renderRightActions={renderRightActions}
        rightThreshold={80}
        onSwipeableOpen={(direction) => {
          if (direction === "right") {
            deleteItem(item.id);
          }
        }}
      >
        <View style={styles.item}>
          <Text>{item.name}</Text>
          <Menu
            visible={menuVisibleId === item.id}
            onDismiss={closeMenu}
            anchor={
              <Icon
                name="dots-vertical"
                size={24}
                onPress={() => openMenu(item.id)}
              />
            }
          >
            <Menu.Item onPress={() => { closeMenu(); editItem(item); }} title="Editar" />
            <Menu.Item onPress={() => { closeMenu(); deleteItem(item.id); }} title="Eliminar" />
          </Menu>
        </View>
      </Swipeable>
    );
  };

  const addItem = () => {
    setCurrentItem(null);
    setInputValue("");
    setVisible(true);
  };

  const saveItem = () => {
    if (inputValue.trim() === "") return;

    if (currentItem) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentItem.id ? { ...item, name: inputValue } : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        name: inputValue
      };
      setData((prevData) => [...prevData, newItem]);
    }
    setVisible(false);
    setCurrentItem(null);
    setInputValue("");
  };

  const editItem = (item) => {
    setCurrentItem(item);
    setInputValue(item.name);
    setVisible(true);
  };

  const deleteItem = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Todo List" />
      </Appbar.Header>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 4 }}
      />
      <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          animationType="slide"
          contentContainerStyle={styles.bottomSheetStyle}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter TODO item"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={saveItem}
          />
          <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <Button mode="outlined" onPress={saveItem} style={styles.optionButton}>
              Save
            </Button>
            <Button mode="outlined" onPress={() => setVisible(false)} style={styles.optionButton}>
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  optionButton: {
    marginVertical: 5
  },
  bottomSheetStyle: {
    backgroundColor: "white",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10
  },
  rightAction: {
    width: 80,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 16
  },
  deleteText: {
    color: "white",
    fontWeight: "bold"
  }
});

