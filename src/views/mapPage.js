import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import { observer } from 'mobx-react';


import helper from '../controllers/helper';

const MapPage = ({ navigation }) => {

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);



    useEffect(() => {
        setLatitude(helper.latitude)
        setLongitude(helper.longitude)
        helper.set('statusBarHidden', true) // komponent ilk kez run edildiğinde StatusBar'ı kaldırmak için helper'daki "statusBarHidden" değişkenin değeri true'ya eşitlendi

        return () => {
            setLatitude(null)
            setLongitude(null)
            helper.set('statusBarHidden', false) //"MapPage" bileşeninden çıkıldığında StatusBar'ı göstermek için helper'daki "statusBarHidden" değişkenin değeri false'a eşitlendi
        }
    }, [])

    return (
        <View
            style={{
                flex: 1
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    position: 'absolute',
                    zIndex: 100,
                    width: 50,
                    height: 50,
                    top: 20,
                    left: 20,
                    backgroundColor: '#fff',
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 10
                }}>
                <IconI name='chatbubble-ellipses-sharp' size={30} color='#1ec897' />
            </TouchableOpacity>
            <MapView
                style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    width: null
                }}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
            >
                <Marker
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude
                    }}
                >

                </Marker>
            </MapView>

        </View>
    )
};

export default observer(MapPage);