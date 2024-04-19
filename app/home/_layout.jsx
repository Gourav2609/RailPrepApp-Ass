import { Tabs } from "expo-router";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HomeLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" 
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen name="logout"
                options={{
                    title: "Logout",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                }}
            />
            <Tabs.Screen name="[id]"
                options={{
                    title: "Sub Category",
                    
                    href: null,
                }}
            />
        </Tabs>
    );
}

export default HomeLayout;
