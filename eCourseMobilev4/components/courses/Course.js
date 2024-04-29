import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React, { useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, List, Searchbar } from "react-native-paper";


const Course = () =>{
    const [categories, setCategories] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [cateId, setCateId] = useState("");
    const loadCates = async () =>{
        try{
            let res =  await APIs.get(endpoints["categories"]);
            setCategories(res.data);
        }
        catch(ex){
            console.error(ex);
        }
    }
    const loadCourses = async() =>{
        setLoading(true);
        let url = `${endpoints['courses']}?q=${q}&category_id=${cateId}`;
        try {
            let res = await APIs.get(url);
            setCourses(res.data.results);
        } catch (error) {
            console.error(ex)
        }finally{
            setLoading(false);
        }
    }
    React.useEffect(() => {
        loadCates();
    }, [])
    React.useEffect(() =>{
        loadCourses();
    },[q, cateId]);
    return(
        <View style={[MyStyles.container, MyStyles.margin]}>
            <View style={[MyStyles.row, MyStyles.wrap]}>
            <Chip mode={cateId?"flat":"outlined"} style={MyStyles.margin} icon={"tag"} onPress={()=>setCateId("")}>Tất cả</Chip>
            {categories === null ? <ActivityIndicator/>:<>
                {categories.map(c=> <Chip mode={cateId===c.id?"outlined":"flat"} style={MyStyles.margin} key={c.id} icon={"tag"} onPress={() => setCateId(c.id)}>{c.name}</Chip>)}
            </>}
            </View> 
            <View>
                <Searchbar placeholder="Tìm khóa học..." value={q} onChangeText={setQ}/>
            </View>
            <ScrollView>
                {loading && <ActivityIndicator/>}
                {courses.map(c=><List.Item key={c.id} title={c.name} description={c.create_date} left={() => <Image style={MyStyles.avatar} source={{uri:c.image}}/>}/>)}
            </ScrollView>
        </View>
    );
}

export default Course;