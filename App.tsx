import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from 'react-native';
import List from './src/List';


const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content"/>

            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={styles.body}>
                        <List/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    body: {
        padding: 30
    },
});

export default App;
