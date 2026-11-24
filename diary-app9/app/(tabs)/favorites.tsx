import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { editDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

export default function FavoritesScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const entries = useAppSelector((state) => state.diary.entries);
    const favoriteEntries = entries.filter((item) => Boolean(item.liked));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Diary Favorit</Text>
                <Text style={styles.subheading}>
                    {favoriteEntries.length} catatan disukai
                </Text>
            </View>

            <FlatList
                data={favoriteEntries}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: "/detail/[id]",
                                params: { id: String(item.id) },
                            })
                        }
                    >
                        <View style={styles.moodBadge}>
                            <Text style={styles.mood}>{item.mood || "📝"}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={styles.date}>{item.diary_date}</Text>
                            <Text style={styles.preview} numberOfLines={2}>
                                {item.preview}
                            </Text>
                        </View>
                        <Pressable
                            hitSlop={10}
                            onPress={() =>
                                dispatch(editDiary({ id: item.id, data: { liked: false } }))
                            }
                        >
                            <Ionicons name="heart" size={24} color="#EF4444" />
                        </Pressable>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Ionicons name="heart-dislike-outline" size={42} color="#94A3B8" />
                        <Text style={styles.empty}>Belum ada diary favorit.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
        paddingTop: 52,
        backgroundColor: "#F1F5F9",
    },
    header: {
        marginBottom: 14,
    },
    heading: {
        fontSize: 28,
        fontWeight: "800",
        color: "#0F172A",
    },
    subheading: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 2,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
    },
    moodBadge: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: "#F8FAFC",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    mood: {
        fontSize: 26,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0F172A",
    },
    date: {
        fontSize: 12,
        color: "#64748B",
        marginVertical: 3,
    },
    preview: {
        fontSize: 13,
        color: "#475569",
        lineHeight: 18,
    },
    emptyBox: {
        alignItems: "center",
        marginTop: 60,
        gap: 8,
    },
    empty: {
        textAlign: "center",
        color: "#64748B",
        fontSize: 15,
    },
});