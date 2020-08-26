import { StyleSheet, Dimensions } from 'react-native';

const w = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    header: {
        width: w,
        height: 70,
        backgroundColor: '#1ec897',
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: {
        height: '100%',
        width: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15
    },
    userAvatarText: {
        fontSize: 20,
        color: '#565656'
    },
    userNameView: {
        flex: 1,
        height: '100%',
        justifyContent: 'center'
    },
    userName: {
        fontSize: 20,
        color: '#fff'
    },
    incomingMessageView: {
        width: w,
        alignItems: 'flex-start',
        marginVertical: 7,
        paddingLeft: 15
    },
    sendMessageView: {
        width: w,
        alignItems: 'flex-end',
        paddingRight: 15,
        marginVertical: 7
    },
    message: {
        borderRadius: 12,
        fontSize: 16,
    },
    inputContainer: {
        width: w,
        minHeight: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ececec',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    input: {
        flex: 1,
        minHeight: 40,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        borderRadius: 100,
        backgroundColor: '#fff',
        fontSize: 18,
        padding: 0,
        paddingHorizontal: 15,
        color: '#5f5f5f'
    },
    sendButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: '#1ec897',
        marginLeft: 15
    },
    imageButton: {
        marginRight: 15
    },


});

export default styles;