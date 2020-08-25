import { StyleSheet, Dimensions } from 'react-native';

const w = Dimensions.get('window').width;

const styles = StyleSheet.create({
    chatItemContainer: {
        width: w,
        height: 75,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
    },
    userAvatar: {
        width: 65,
        height: 65,
        backgroundColor: '#26b3ff',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15
    },
    userAvatarText: {
        color: '#fff',
        fontSize: 27,
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
        fontSize: 20,
        marginBottom: 2,
        width: '80%'
    },
    userLastMessage: {
        fontSize: 14,
        color: '#595959',
        width: '80%'
    }
});

export default styles;