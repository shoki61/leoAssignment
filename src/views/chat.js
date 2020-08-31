import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/FontAwesome5';
import IconFeather from 'react-native-vector-icons/Feather'
import database from '@react-native-firebase/database';
import { observer } from 'mobx-react';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import SImage from 'react-native-scalable-image';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import styles from '../styles/chatStyle';
import helper from '../controllers/helper';


const Chat = ({ navigation }) => {


    const replyListRef = useRef(null);

    const [userMessage, setUserMessage] = useState('') //inputa yazılan mesajı tutan state değişkeni
    const [image, setImage] = useState(null) //seçilen resim yolunu tutan state değişkeni

    const [time, setTime] = useState('') //şu anki saati tutan state değişkeni
    const [date, setDate] = useState('') //şu anki tarihi tutan state değişkeni
    const [inputHeight, setInputHeight] = useState('') //inputun height'ını tutan state değişkeni
    const [transferred, setTransferred] = useState(0); //resim gönderirken görünen progress bar değerini tutan state değişkeni
    const [latitude, setLatitude] = useState(null); // konumdaki enlem değerini tutan state değişkeni
    const [longitude, setLongitude] = useState(null); //konumdaki boylam değerini tutan state değişkeni

    useEffect(() => {
        helper.set('showTabNavigator', false); //komponent ilk run edildiğinde "Tab Navigation" kısmının gizlenmesi için helper'daki  "showTabNavigator" değişkeni false a eşitlendi
        database()
            .ref()
            .on('value', () => {
                //kulanıcı ve sohbet ettiği kişiye ait olan sohbet içeriğini eşzamanlı olarak çeker ve helper'daki "existingMesseges" dizisine eşitler
                fetch(`https://leo-assignment.firebaseio.com/chatContent/${helper.username}>${helper.userChatWith}.json`)
                    .then(response => {
                        return response.json();
                    }).then(responseData => {
                        if (responseData !== null) {
                            const temp = []
                            for (let key in responseData) {
                                temp.push(
                                    responseData[key]
                                )
                            }
                            helper.set('existingMessages', temp)
                        }
                    })
            })
        return () => { // chat sayfasından çıkıldığında çalışan arrow fonksiyonu
            helper.set('showTabNavigator', true)  // helper'daki "showTabNavigator" true ya eşitlenir ve "Tab Navigation" görünür olur 
            helper.set('existingMessages', [])    // helper'daki "existingMessages" adında sohbetleri tutan dizi boş bir array'e eşitlendi
        }

    }, [])

    useEffect(() => {  //"existingMessages" içeriği her değiştiğinde tarihi ve saati yenileyen useEffect() 
        let today = new Date()
        //  "('0' + today.getHours()).slice(-2)" bu ifade eğer tek haneli bir rakam ise önüne "0" ekler.  Veritabanında karmaşıklığa yol açmaması için yapıldı
        setTime(('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2) + ":" + ('0' + today.getSeconds()).slice(-2))
        setDate(('0' + today.getDate()).slice(-2) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getFullYear()).slice(-2))
    }, [helper.existingMessages])


    const messageInputHandler = (enteredText) => { //inputa girilen değeri "userMessage" değişkenine eşitleyen fonksiyon
        setUserMessage(enteredText);
    }


    const Header = () => { //chat sayfasının yukarısında sohbet edilen kişinin adını gösteren ve geri(<) butonunu barındıran bileşen
        const userAvatarName = helper.userChatWith[0].toUpperCase() + helper.userChatWith[1].toUpperCase()//sohbet edilen kişinin adının ilk iki harfini alır ve büyük harfe dönüştürerek "userAvatarName" değişkenine eşitler 
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Chats')} style={styles.backButton}>
                    <IconI name='arrow-back-sharp' size={35} color='#fff' />
                </TouchableOpacity>

                <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{userAvatarName}</Text>
                </View>

                <View style={styles.userNameView}>
                    <Text style={styles.userName}>{helper.userChatWith}</Text>
                </View>
            </View>
        )
    }

    const goMapPage = (location) => { //gönderilen konum bilgisini haritada açmak için "MapPage" komponentine yönlendiren fonksiyon
        helper.set('longitude', location.longitude) //konum bilgisindeki boylam değerini helper'deki "longitude" değişkenine eşitler
        helper.set('latitude', location.latitude) //konum bilgisindeki enlem değerini helper'deki "latitude" değişkenine eşitler
        navigation.navigate('MapPage')
    }

    const incomingMessage = (item) => { //gelen mesajı run eden fonksiyon
        return (
            <View style={styles.incomingMessageView}>
                <View style={[item.message && { backgroundColor: '#f5f5f5', maxWidth: '65%', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 }]}>
                    {   //gönderilen mesaj ise run edilir
                        item.message &&
                        <Text style={[styles.message, { color: '#434343' }]}>{item.message}</Text>
                    }
                    {   //gönderilen resim ise run edilir
                        item.imageURL &&
                        <SImage source={{ uri: item.imageURL }} width={200} borderRadius={10} />
                    }
                    {   //gönderilen konum ise run edilir
                        item.location &&
                        <TouchableOpacity
                            onPress={() => goMapPage(item.location)}
                            style={{ borderWidth: 3, borderColor: '#00c3ff', overflow: 'hidden', borderRadius: 10, width: 250, height: 140 }}>
                            <MapView
                                toolbarEnabled={false}
                                scrollEnabled={false}
                                initialRegion={{
                                    latitude: item.location.latitude,
                                    longitude: item.location.longitude,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.001
                                }}
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    width: null
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: item.location.latitude,
                                        longitude: item.location.longitude
                                    }}
                                >
                                    <IconI name='pin-sharp' size={35} color={'#ff4242'} />
                                </Marker>

                            </MapView>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    const sendMessage = (item) => { //gönderilen mesajı run eden fonksiyon
        return (
            <View style={styles.sendMessageView}>
                <View style={[item.message && styles.messageContainer]}>
                    {   //gönderilen mesaj ise run edilir
                        item.message &&
                        <Text style={[styles.message, { color: '#fff' }]}>{item.message}</Text>
                    }
                    {   //gönderilen resim ise run edilir
                        item.imageURL &&
                        <SImage source={{ uri: item.imageURL }} width={200} borderRadius={10} />
                    }
                    {   //gönderilen konum ise run edilir
                        item.location &&
                        <TouchableOpacity
                            onPress={() => goMapPage(item.location)}
                            style={{ borderWidth: 3, borderColor: '#00c3ff', overflow: 'hidden', borderRadius: 10, width: 250, height: 140 }}>
                            <MapView
                                toolbarEnabled={false}
                                scrollEnabled={false}
                                initialRegion={{
                                    latitude: item.location.latitude,
                                    longitude: item.location.longitude,
                                    latitudeDelta: 0.001,
                                    longitudeDelta: 0.001
                                }}
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    width: null
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: item.location.latitude,
                                        longitude: item.location.longitude
                                    }}
                                >
                                    <IconI name='pin-sharp' size={35} color={'#ff4242'} />
                                </Marker>

                            </MapView>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    const sendMessageFunction = (value, url) => { //mesajı veritabanına kaydeden fonksiyon

        if (value === 'image') { // gönderilen veri resim ise çalışır 
            const refChatContentUser = database().ref(`chatContent/${helper.username}>${helper.userChatWith}/${time + ' ' + date}`); //kullanıcıya ait veri tabanı oluşturulur
            refChatContentUser.set({ //oluşturulan veri tabanına bir Object gönderir
                imageURL: url._W, // firebase storage kısmında kullanıcıya ait olan resmin yolu
                who: helper.username //gönderen kullanıcının adı
            })
            const refUserWith = database().ref(`chatContent/${helper.userChatWith}>${helper.username}/${time + ' ' + date}`); //sohbet edilen kişiye ait veri tabanı oluşturulur
            refUserWith.set({
                imageURL: url._W,
                who: helper.username
            })
            const refChatsUser = database().ref(`chats/${helper.username}/${helper.userChatWith}`); //kullanıcı ve sohbet edilen kişiye ait "chats" adında veri tabanı oluşturulur
            refChatsUser.set({
                name: helper.userChatWith, //sohbet edilen kişinin adı
                lastMessage: 'resim gönderildi' //son gönderilen veri resim ise sohbetler kısmında gösterilecek olan mesaj
            })

            const refChatsUserWith = database().ref(`chats/${helper.userChatWith}/${helper.username}`); // sohbet edilen kişi ve kullanıcıya ait "chats" adında veri tabanı oluşturulur
            refChatsUserWith.set({
                name: helper.username, // kullanıcın adı
                lastMessage: 'resim gönderildi'
            })
        }
        else if (value === 'location') { // gönderilen veri konum ise çalışır 
            const refChatContentUser = database().ref(`chatContent/${helper.username}>${helper.userChatWith}/${time + ' ' + date}`);
            refChatContentUser.set({
                location: { //kullanıcın konumdaki enlem ve boylam değerlerini tutan object
                    latitude: latitude,
                    longitude: longitude
                },
                who: helper.username
            })

            const refUserWith = database().ref(`chatContent/${helper.userChatWith}>${helper.username}/${time + ' ' + date}`);
            refUserWith.set({
                location: { //kullanıcın konumdaki enlem ve boylam değerlerini tutan object
                    latitude: latitude,
                    longitude: longitude
                },
                who: helper.username
            })
            const refChatsUser = database().ref(`chats/${helper.username}/${helper.userChatWith}`);
            refChatsUser.set({
                name: helper.userChatWith,
                lastMessage: 'konum gönderildi' //son gönderilen veri konum ise sohbetler kısmında gösterilecek olan mesaj
            })

            const refChatsUserWith = database().ref(`chats/${helper.userChatWith}/${helper.username}`);
            refChatsUserWith.set({
                name: helper.username,
                lastMessage: 'konum gönderildi'
            })
        } else { // gönderilen veri konum veya resim değilse çalışır  
            if (userMessage !== '') {
                const refChatContentUser = database().ref(`chatContent/${helper.username}>${helper.userChatWith}/${time + ' ' + date}`);
                refChatContentUser.set({
                    message: userMessage,
                    who: helper.username
                })

                const refUserWith = database().ref(`chatContent/${helper.userChatWith}>${helper.username}/${time + ' ' + date}`);
                refUserWith.set({
                    message: userMessage,
                    who: helper.username
                })

                const refChatsUser = database().ref(`chats/${helper.username}/${helper.userChatWith}`);
                refChatsUser.set({
                    name: helper.userChatWith,
                    lastMessage: userMessage
                })

                const refChatsUserWith = database().ref(`chats/${helper.userChatWith}/${helper.username}`);
                refChatsUserWith.set({
                    name: helper.username,
                    lastMessage: userMessage
                })
            }
            setUserMessage('')  //mesaj gönderildikten sonra inputun içi otomatik boş olması için "userMessage"in değeri boş stringe eşitlendi
        }

    }

    const getImage = async () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                setImage(source) //seçilen resmin yolu image değişkenine eşitlendi

            }
        });

    }

    const uploadImage = async () => { //seçilen resimi firebase storage'a kaydeden fonksiyon
        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);   // resmin adını resmin yolundan filtrelemek için yapıldı  
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setTransferred(0);

        const task = storage() //resimi kullanıcıya ait olarak  firebase storage'a kaydeder
            .ref(`${helper.username}${helper.userChatWith}${filename}`)  //kaydedilen resimin adını belirler
            .putFile(uploadUri); // seçilen resim

        const task1 = storage() //resimi gönderilen kişiye ait olarak  firebase storage'e kaydeder
            .ref(`${helper.userChatWith}${helper.username}${filename}`)
            .putFile(uploadUri);


        task.on('state_changed', snapshot => { //resimin progress bar çubuğunu doldurur
            setTransferred(
                Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
            );
        });
        try {
            await task;
            await task1;
        } catch (e) {
            console.error(e);
        }


        setImage(null);

        const url = storage().ref(`${helper.username}${helper.userChatWith}${filename}`).getDownloadURL() //gönderilen resimin firebase storage'daki yolunu dönderir
        setTimeout(() => { //gönderilen resimin firebase storage'daki yolunu veri tabanına kaydeden "sendMessageFunction" fonksiyonuna parametre olarak gönderir
            sendMessageFunction('image', url)
        }, 1000)

        setTransferred(0) //resim gönderildikten sonra gönderimi gösteren çubuğu başa almak için değeri 0 yapıldı


    };


    const sendLocation = async () => { //konumu belirleyen fonksiyon
        await Geolocation.getCurrentPosition(
            async (info) => {
                await setLatitude(info.coords.latitude);
                await setLongitude(info.coords.longitude);
            },
            (error) => console.log(error),
            {
                enableHighAccuracy: true,
            },
        );
        if (latitude > 0 || longitude > 0) {
            setTimeout(() => {
                sendMessageFunction('location')
            }, 500)
        } else {
            alert('Lütfen konum servislerinizin açık olduğundan emin olun!')
        }

    }




    return (
        <View style={styles.container} >
            <Header />

            <FlatList
                ref={replyListRef}
                onContentSizeChange={() => {
                    replyListRef.current.scrollToEnd(); //FlatList in içeriği büyüdüğünde scroll en alta kayması için yapıldı
                }}
                contentContainerStyle={{ paddingTop: 15, paddingBottom: 5 }}
                data={helper.existingMessages}

                // veri tabanından gelen veri kullanıcıya ait ise "sendMessage" bileşeni run edilir, sohbet edilen kişiye ait ise "incomingMessage" bileşeni run edilir
                renderItem={messageItem => messageItem.item.who === helper.username ? sendMessage(messageItem.item) : incomingMessage(messageItem.item)}
            />

            <View style={[styles.inputContainer, image !== null && { justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={getImage}
                        style={styles.inputContainerLeftIcon}>
                        <IconI name='image' size={35} color={'#ff8d12'} />
                    </TouchableOpacity>
                    {
                        image === null ? //eğer kullanıcı resim gönderecekse konum gönderme butonu kaldırılır yerine X(vazgeç) butonu run edilir
                            <TouchableOpacity
                                onPress={sendLocation}
                                style={styles.inputContainerLeftIcon}>
                                <IconF name='map-marker-alt' size={27} color={'#ff7373'} />
                            </TouchableOpacity> :
                            <TouchableOpacity
                                onPress={() => setImage(null)}>
                                <IconFeather name='x' size={27} color={'#4099ff'} />
                            </TouchableOpacity>
                    }

                </View>

                {
                    image !== null ? //resim seçilirse input kaldırılır yerine seçilen resim run edilir

                        <View>
                            <SImage source={image} width={200} borderRadius={10} />
                            <View style={{ marginTop: 5 }}>
                                <Progress.Bar
                                    color='#1ec897'
                                    progress={transferred}
                                    width={200} />
                            </View>
                        </View>
                        :
                        <TextInput
                            value={userMessage}
                            onChangeText={messageInputHandler}
                            style={[styles.input, inputHeight > 50 && { borderRadius: 15 }]}
                            multiline
                            onFocus={() => { // klavye çıktığında FlatListin scroll'ı en alta kayması için 
                                setTimeout(() => replyListRef.current.scrollToEnd(), 300)
                            }}
                            onContentSizeChange={(event) => { //inputun height'i değiştikçe çağırılan fonksiyon
                                setInputHeight(Math.floor(event.nativeEvent.contentSize.height))  //inputun değişen height değerini "inputHeight" değişkenine eşitler
                            }}
                            placeholder={'Mesaj yaz...'} />
                }

                <TouchableOpacity

                    //eğer kullanıcı resim seçerse ve gönder butonuna tıklarsa "uploadImage" fonksiyonu çalışır yoksa "sendMessageFunction" fonksiyonu çalışır
                    onPress={image !== null ? uploadImage : sendMessageFunction}

                    style={styles.sendButton}>
                    <IconM name='send' size={20} color={'#fff'} />
                </TouchableOpacity>
            </View>
        </View >
    )
};

export default observer(Chat);