import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {HeaderComponent, MainComponent} from '../components/NoteComponent';
import {useState, useEffect} from 'react';
import realm from '../../store/realm';

export class EditNoteScreen extends Component {
  render() {
    const EditNoteScreen = props => {
      const {route, navigation} = props;
      const id = route.params.datas;

      const [dataToUpdate, setDataToUpdate] = useState([]);
    };

    useEffect(() => {
      const data = realm.objects('Note').filtered(`id = ${id}`);
      setDataToUpdate(data);
    }, []);

    useEffect(() => {
      console.log('edit screen');
      console.log(dataToUpdate);
    }, [dataToUpdate]);

    return (
      <View style={styles.mainContainer}>
        <HeaderComponent title="Edit" />
        <MainComponent date="Date" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default EditNoteScreen;
