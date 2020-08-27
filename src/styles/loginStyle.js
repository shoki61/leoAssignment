import { StyleSheet, Dimensions } from 'react-native';


const w = Dimensions.get('window').width;

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputContainer: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 2,
        borderColor: '#1ec897',
        borderRadius: 100,
        elevation: 7,
        backgroundColor: '#fff'
    },
    inputIcon: {
        height: 50,
        width: 50,
        backgroundColor: '#1ec897',
        borderRadius: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 3
    },
    input: {
        flex: 1,
        padding: 5,
        fontSize: 18,
        color: '#565656'
    },
    errorMessage: {
        color: '#e34949',
        width: '65%',
        textAlign: 'center',
        marginTop: 5
    },
    button: {
        height: 50,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1ec897',
        borderRadius: 100,
        marginTop: 35,
        elevation: 7
    }
});

export default styles;