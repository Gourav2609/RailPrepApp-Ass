import { Tabs , useRouter} from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

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
