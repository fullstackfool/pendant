import React, {Component} from 'react';
import {Button, Text, View, PermissionsAndroid, FlatList} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';

const manager = new BleManager();

async function requestLocationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
                title: 'Location permission for bluetooth scanning',
                message: 'Whatever',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission for bluetooth scanning granted');

            return true;
        }

        console.log('Location permission for bluetooth scanning revoked');

        return false;

    } catch (err) {
        console.warn(err);
        return false;
    }
}

class List extends Component {
    state = {
        bluetoothStatus: 'disabled',
        devices: [],
        scanning: false
    };

    constructor(stuff: any) {
        super(stuff);
    }

    addDevice(device: Device) {
        if (this.state.devices.find(item => item.name === device.name)) {
            return;
        }

        this.setState(prevState => ({
            devices: [...prevState.devices, device]
        }));
    }

    async scan() {
        const permission = await requestLocationPermission();

        if (permission) {
            this.setState({scanning: true});

            manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.warn(error);
                    return;
                }

                if (device) {
                    console.log(device.name);
                    this.addDevice(device);
                }
            });
        }
    }

    stopScan() {
        manager.stopDeviceScan();
        this.setState({scanning: false});
    }

    componentDidMount() {
        const subscription = manager.onStateChange(state => {
            if (state === 'PoweredOn') {
                this.setState({bluetoothStatus: 'enabled'});

                return subscription.remove();
            }

            this.setState({bluetoothStatus: 'disabled'});
        }, true);
    }


    render() {
        let button;

        if (!this.state.scanning) {
            button = <Button title="Scan" onPress={() => this.scan()}/>;
        } else {
            button = <Button title="Stop Scan" onPress={() => this.stopScan()}/>;
        }

        return (
            <View style={{flex: 1, padding: 15, justifyContent: 'center'}}>
                <Text style={{fontSize: 20, alignSelf: 'center', color: 'blue'}}>
                    Bluetooth is {this.state.bluetoothStatus}
                </Text>

                <View style={{marginVertical: 15}}>
                    {button}
                </View>

                <FlatList data={this.state.devices} renderItem={({item}) => <Text>{item.name}</Text>}/>
            </View>
        );
    }
}

export default List;