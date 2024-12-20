import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Icon, CheckBox} from 'react-native-elements';
import realm from '../../store/realm';

const NoteListScreen = props => {
  const {navigation} = props;
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const searchData = value => {
    const dataFromDatabase = realm.objects('Note').sorted('date', true);

    const searchedData = dataFromDatabase.filter(item => {
      const itemData = item.note.toLowerCase();
      const valueData = value.toLowerCase();
      return itemData.indexOf(valueData) > -1;
    });

    setData(searchedData);
    setSearchText(value);
  };

  const removeNotes = () => {
    const checkTrue = [];

    data.forEach(item => {
      if (item.checkedStatus) {
        checkTrue.push(item.id);
      }
    });
    if (checkTrue.length !== 0) {
      realm.write(() => {
        for (let i = 0; i < checkTrue.length; i++) {
          const data = realm.objects('Note').filtered(`id = ${checkTrue[i]}`);
          realm.delete(data);
        }
      });
      const collect = realm.objects('Note').sorted('date', true);
      const newData = collect.map(item => {
        item.checkedStatus = false;
        return item;
      });
      setData(newData);

      setIsEdit(false);
    } else {
      alert('Nothing to remove!');
    }
  };

  const setCheckBox = (id, status) => {
    const newData = data.map(item => {
      if (item.id === id) {
        item.checkedStatus = !status;
      }
      return item;
    });

    setData(newData);
  };

  const dateFormat = date => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const noteDate = new Date(date);
    const dateOnly = noteDate.getDate();
    const monthOnly = noteDate.getMonth();
    const yearOnly = noteDate.getFullYear();

    return months[monthOnly] + ' ' + dateOnly + ', ' + yearOnly;
  };

  useEffect(() => {
    const noteListPage = navigation.addListener('focus', () => {
      const notes = realm.objects('Note');
      const notesByDate = notes.sorted('date', true);
      const newData = notesByDate.map(item => {
        item.checkedStatus = false;
        return item;
      });
      setData(newData);
      setSearchText('');
    });

    return noteListPage;
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notes</Text>
        {data.length !== 0 ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEdit(!isEdit)}>
            <Text>{isEdit ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={data}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        ListHeaderComponent={
          <View style={styles.searchBox}>
            <Icon
              name="search"
              type="font-awesome"
              size={18}
              style={styles.searchIcon}
              color="grey"
            />
            <TextInput
              placeholder="Search here"
              style={styles.searchInput}
              onChangeText={text => searchData(text)}
              value={searchText}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyOne}>
            <Text>There's nothing like that</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.mainDataContainer}>
            <TouchableOpacity
              style={styles.noteButton}
              onPress={() => navigation.navigate('EditNote', {id: item.id})}>
              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>{item.note}</Text>
              </View>
              <Text style={styles.dateText}>{dateFormat(item.date)}</Text>
            </TouchableOpacity>
            {isEdit ? (
              <CheckBox
                size={20}
                containerStyle={styles.checkBox}
                onPress={() => setCheckBox(item.id, item.checkedStatus)}
                checked={item.checkedStatus}
              />
            ) : null}
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateNote')}>
          <Icon name="plus" type="antdesign" size={24} color="white" />
        </TouchableOpacity>
        {isEdit ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeNotes()}>
            <Icon name="delete" type="antdesign" size={20} color="white" />
            <View style={styles.containerDeleteText}>
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default NoteListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  headerContainer: {
    padding: 8,
    backgroundColor: 'moccasin',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    padding: 8,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  addButton: {
    backgroundColor: 'pink',
    padding: 16,
    borderRadius: 100,
  },
  flatListContainer: {
    padding: 3,
  },
  mainDataContainer: {
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noteButton: {
    flex: 1,
    padding: 10,
    margin: 6,
  },
  noteContainer: {
    maxHeight: 40,
    paddingBottom: 8,
  },
  noteText: {
    textAlign: 'justify',
  },
  dateText: {
    fontSize: 12,
  },
  searchBox: {
    color: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    margin: 9,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchIcon: {
    padding: 8,
    paddingRight: 0,
  },
  searchInput: {
    height: 30,
    padding: 8,
    flex: 1,
  },
  emptyOne: {
    alignItems: 'center',
    margin: 8,
  },
  checkBox: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  editButton: {
    position: 'absolute',
    padding: 16,
    right: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    right: 140,
  },
  containerDeleteText: {
    marginLeft: 8,
  },
  deleteText: {
    color: 'white',
  },
});
