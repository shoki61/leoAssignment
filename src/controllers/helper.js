import { observable, action, decorate } from 'mobx';

class helper {

    showTabNavigator = true

};

decorate(
    helper,
    {
        showTabNavigator: observable
    }
);

export default new helper();