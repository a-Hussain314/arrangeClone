import React from 'react';
import { View, Text, } from 'react-native';
import { AuthContext } from '../../../contexts/AuthContext';
import { Container, Content } from 'native-base';
import { getService } from '../../../services/getServices';
export default function GetSetNotification({ getNotificationCount }) {
    // const { notificationCount } = React.useContext(AuthContext);

    React.useEffect(() => {
        console.log("enter in getSetNotification ==>", getNotificationCount);
        //  getNotifyCount();
    }, []);
    const getNotifyCount = () => {
        console.log("enter in getSetNotification ==>", getNotificationCount);
        //***** api calling */
        getService(`profile/notifications-count`)
            .then(async (res) => {

                console.log("suser/profile/notifications-count ==> ",);
                if (res.data.status === 1) {
                    console.log("res.data.response.count", res.data && res.data.response && res.data.response.count);
                    // await notificationCount(res.data && res.data.response && res.data.response.count);
                } else {

                    setTimeout(function () {
                        // showDangerToast(res.data.message);
                    }, 100);
                }
            })
            .catch(error => {

                setTimeout(function () {
                    alert(error);
                }, 100);
            });
    };

    return (
        <Container style={{ flex: 1, }}>

        </Container>
    );
}

const styles = {
    container: {
        flex: 1,
    },

};
