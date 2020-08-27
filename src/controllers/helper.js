import { observable, action, decorate } from 'mobx';

class helper {

    showTabNavigator = true

    username = ''

    userID = ''

    set = (i, v) => (this[i] = v)


};

decorate(
    helper,
    {
        showTabNavigator: observable,
        username: observable,
        userID: observable,

        set: action
    }
);

export default new helper();