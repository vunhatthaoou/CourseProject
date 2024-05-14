import {
  Image,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  List,
  TextInput,
} from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { isCloseToBottom } from "../utils/Utils";
import moment from "moment";

const LessonDetails = ({ route }) => {
  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const lessonId = route.params?.lessonId;
  const { width } = useWindowDimensions();
  const loadLesson = async () => {
    try {
      let res = await APIs.get(endpoints["lesson-detail"](lessonId));
      setLesson(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  const loadComments = async () => {
    if (page > 0) {
      setLoading(true);
      let url = `${endpoints["comments"](lessonId)}?page=${page}`;
      try {
        let res = await APIs.get(url);
        if (page === 1) setComments(res.data.results);
        else
          setComments((current) => {
            return [...current, ...res.data.results];
          });
        if (res.data.next === null) setPage(0);
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    loadLesson();
  }, [lessonId]);
  useEffect(() => {
    loadComments();
  }, [lessonId, page]);
  const loadMoreInfo = ({ nativeEvent }) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
      setPage(page + 1);
    }
  };
  return (
    <View style={MyStyles}>
      <ScrollView onScroll={loadMoreInfo}>
        {lesson === null ? (
          <ActivityIndicator />
        ) : (
          <>
            <Card>
              <Card.Title
                title={lesson.subject}
                titleStyle={MyStyles.subject}
              />
              <Card.Cover source={{ uri: lesson.image }} />
              <Card.Content>
                <View style={MyStyles.row}>
                  {lesson.tags.map((t) => (
                    <Chip icon="tag" style={MyStyles.margin} key={t.id}>
                      {t.name}
                    </Chip>
                  ))}
                </View>
                <Text variant="bodyMedium">
                  <RenderHTML
                    contentWidth={width}
                    source={{ html: lesson.content }}
                  />
                </Text>
              </Card.Content>
            </Card>
          </>
        )}
        <View>
          <TextInput
            style={MyStyles.margin}
            label="Nội dung bình luận..."
            value={content}
            onChangeText={setContent}
            multiline={true}
          />
          <View style={[MyStyles.row, { justifyContent: "flex-end" }]}>
            <Button
              style={MyStyles.margin}
              buttonColor="blue"
              icon="comment"
              textColor="white"
            >
              Thêm bình luận
            </Button>
          </View>
        </View>
        <View>
          {comments && (
            <>
              {comments.map((c) => (
                <List.Item
                  key={c.id}
                  title={c.content}
                  description={moment(c.create_date).fromNow()}
                  left={() => (
                    <Image
                      source={{ uri: c.user.avatar }}
                      style={MyStyles.avatar}
                    />
                  )}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default LessonDetails;
