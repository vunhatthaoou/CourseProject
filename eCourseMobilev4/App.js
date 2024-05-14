import { createStackNavigator } from "@react-navigation/stack";
import Course from "./components/courses/Course";
import Lesson from "./components/courses/Lesson";
import { NavigationContainer } from "@react-navigation/native";
import LessonDetails from "./components/courses/LessonDetails";
import "moment/locale/vi";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Register from "./components/users/Register";
import Login from "./components/users/Login";
import { Icon } from "react-native-paper";
const Stack = createStackNavigator();
const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Course" component={Course} />
      <Stack.Screen name="Lesson" component={Lesson} />
      <Stack.Screen name="LessonDetails" component={LessonDetails} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const MyTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={MyStack}
        options={{
          title: "Danh mục khóa học",
          tabBarIcon: () => <Icon source="home" color="blue" size={30} />,
        }}
      />
      <Tab.Screen
        name="Register"
        component={Register}
        options={{
          title: "Đăng ký",
          tabBarIcon: () => <Icon source="account" color="blue" size={30} />,
        }}
      />
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          title: "Đăng nhâp",
          tabBarIcon: () => <Icon source="login" color="blue" size={30} />,
        }}
      />
    </Tab.Navigator>
  );
};
const App = () => {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
};
export default App;
