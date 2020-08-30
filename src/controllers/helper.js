import { observable, action, decorate } from 'mobx';

class helper {

    message = ''

    showTabNavigator = true

    username = ''

    userID = ''

    userChatHistory = []

    userChatWith = ''

    existingMesseges = ''

    users = []

    latitude = ''

    longitude = ''

    statusBarHidden = false

    set = (i, v) => (this[i] = v)


};

decorate(
    helper,
    {
        showTabNavigator: observable,
        username: observable,
        userID: observable,
        userChatHistory: observable,
        userChatWith: observable,
        existingMesseges: observable,
        users: observable,
        latitude: observable,
        latitude: observable,
        statusBarHidden: observable,

        set: action
    }
);

export default new helper();