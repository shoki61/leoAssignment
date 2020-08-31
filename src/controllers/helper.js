import { observable, action, decorate } from 'mobx';

class helper {


    showTabNavigator = true //"Tab Navigation"nın gösterilip gösterilmeyeceğini belirleyen değişken

    username = '' //kullanıcının adını tutan değişken


    userChatHistory = [] //kullanıcın sohbetlerini tutan array

    userChatWith = '' //sohbet edilecek olan kişinin adını tutan değişken

    existingMessages = [] //yapılan mesajlaşmaları tutan array

    users = [] //kullanıcıları tutan array

    latitude = '' //enlem değerini tutan değişken

    longitude = '' //boylam değerini tutan değişken

    statusBarHidden = false //"StatusBar"ın gizlenip gizlenmeyeceğini belirleyen değişken

    set = (i, v) => (this[i] = v)  //helper'de tanımlanmış olan bütün değişkenlerin değerlerini değiştiren fonksiyon


};

decorate(
    helper,
    {
        showTabNavigator: observable,
        username: observable,
        userID: observable,
        userChatHistory: observable,
        userChatWith: observable,
        existingMessages: observable,
        users: observable,
        latitude: observable,
        latitude: observable,
        statusBarHidden: observable,

        set: action
    }
);

export default new helper();