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

        set: action
    }
);

export default new helper();