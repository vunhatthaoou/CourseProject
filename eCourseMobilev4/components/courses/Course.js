import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, List, Searchbar } from "react-native-paper";
import Item from "../utils/Item";
import { isCloseToBottom } from "../utils/Utils";

const Course = ({ navigation }) => {
  const [categories, setCategories] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [cateId, setCateId] = useState("");
  const [page, setPage] = useState(1);
  const loadCates = async () => {
    try {
      let res = await APIs.get(endpoints["categories"]);
      setCategories(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  const loadCourses = async () => {
    if (page > 0) {
      setLoading(true);
      let url = `${endpoints["courses"]}?q=${q}&category_id=${cateId}&page=${page}`;
      try {
        let res = await APIs.get(url);
        if (page === 1) setCourses(res.data.results);
        else
          setCourses((current) => {
            return [...current, ...res.data.results];
          });
        if (res.data.next === null) setPage(0);
      } catch (error) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    loadCates();
  }, []);
  React.useEffect(() => {
    loadCourses();
  }, [q, cateId, page]);

  const loadMore = ({ nativeEvent }) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) setPage(page + 1);
  };
  const search = (value, callback) => {
    setPage(1);
    callback(value);
  };

  return (
    <View style={[MyStyles.container, MyStyles.margin]}>
      <View style={[MyStyles.row, MyStyles.wrap]}>
        <Chip
          mode={cateId ? "flat" : "outlined"}
          style={MyStyles.margin}
          icon={"tag"}
          onPress={() => search("", setCateId)}
        >
          Tất cả
        </Chip>
        {categories === null ? (
          <ActivityIndicator />
        ) : (
          <>
            {categories.map((c) => (
              <Chip
                mode={cateId === c.id ? "outlined" : "flat"}
                style={MyStyles.margin}
                key={c.id}
                icon={"tag"}
                onPress={() => search(c.id, setCateId)}
              >
                {c.name}
              </Chip>
            ))}
          </>
        )}
      </View>
      <View>
        <Searchbar
          placeholder="Tìm khóa học..."
          onChangeText={(t) => search(t, setQ)}
          value={q}
        />
      </View>
      <ScrollView onScroll={loadMore}>
        {loading && <ActivityIndicator />}
        {courses.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => navigation.navigate("Lesson", { courseId: c.id })}
          >
            <Item instance={c} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Course;
