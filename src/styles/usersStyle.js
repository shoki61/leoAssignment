import { StyleSheet, Dimensions } from 'react-native';

const w = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    chatItemContainer: {
        width: w,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4
    },
    userAvatar: {
        width: 50,
        height: 50,
        backgroundColor: '#26b3ff',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    userAvatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    messagesContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        borderBottomColor: '#bababa',
        borderBottomWidth: 1,
    },
    userName: {
        fontSize: 18,
        width: '80%'
    },
});

export default styles;