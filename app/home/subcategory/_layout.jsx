import { Stack  , useRouter } from "expo-router";

const RootLayout = () => {

    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={({ route }) => ({
                    title: (route && route.params && route.params.name) || "Sub Category",
                    headerShown: true,
                    // href: null,
                  })}
            />
        </Stack>
    )
}
export default RootLayout;