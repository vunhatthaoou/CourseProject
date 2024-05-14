import { Image } from "react-native";
import { List } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import moment from "moment/moment";

const Item = ({ instance }) => {
  return (
    <List.Item
      title={!instance.name ? instance.subject : instance.name}
      description={moment(instance.create_date).fromNow()}
      left={() => (
        <Image style={MyStyles.avatar} source={{ uri: instance.image }} />
      )}
    />
  );
};
export default Item;
