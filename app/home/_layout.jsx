import { Tabs , useRouter} from "expo-router";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HomeLayout = () => {

    const router = useRouter();

    return (
        <Tabs>
            <Tabs.Screen name="index" 
                options={{
                    title: "RailPrep",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen name="logout"
                options={{
                    title: "Logout",
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                }}
            />
            <Tabs.Screen 
                name="[id]"
                // options={({ route }) => ({
                //     href: null,
                //     title: (route && route.params && route.params.name) || "Sub Category",
                //     headerShown: true,
                //   })}

                options={{
                    href:null,
                    title:"Sub Category",
                }}
            />
            <Tabs.Screen name="subcategory"
                options={{
                    href:null,
                    headerShown: false,
                }}
                />
        </Tabs>
    );
}

export default HomeLayout;
