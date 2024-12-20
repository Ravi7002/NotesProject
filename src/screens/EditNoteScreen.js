import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {HeaderComponent, MainComponent} from '../components/NoteComponent';
import realm from '../../store/realm';

const EditNoteScreen = props => {
  const {route, navigation} = props;
  const id = route.params.id;
  const [dataToUpdate, setDataToUpdate] = useState([]);
  const [newNote, setNewNote] = useState(''); // Untuk menyimpan catatan yang baru
  const [isEdit, setIsEdit] = useState(false); // Untuk status edit

  const saveNote = value => {
    if (value === '') {
      alert('Note can’t be empty!');
    } else {
      const allData = realm.objects('Note');
      allData.forEach(item => {
        if (item.id === id && item.note !== value) {
          realm.write(() => {
            item.note = value;
            item.date = new Date().toISOString();
          });
          navigation.navigate('NoteList');
        } else if (item.id === id && item.note === value) {
          alert('Nothing changed!');
        }
      });
    }
  };

  // Fungsi untuk format tanggal
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

  // Fungsi untuk mengedit catatan dan mengubah status edit
  const editNote = (value, editStatus) => {
    setNewNote(value);
    setIsEdit(editStatus);
  };

  // Mengambil data dari Realm berdasarkan ID
  useEffect(() => {
    const data = realm.objects('Note').filtered(`id = ${id}`);
    if (data.length > 0) {
      setDataToUpdate(data);
      setNewNote(data[0].note); // Mengisi data awal untuk diedit
    }
  }, [id]);

  return (
    <View style={styles.mainContainer}>
      <HeaderComponent
        title="Edit"
        onPress={() => saveNote(isEdit ? newNote : dataToUpdate[0].note)}
      />
      {dataToUpdate.length > 0 && (
        <MainComponent
          date={dateFormat(dataToUpdate[0].date)}
          value={isEdit ? newNote : dataToUpdate[0].note}
          onChangeText={text => editNote(text, true)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default EditNoteScreen;
