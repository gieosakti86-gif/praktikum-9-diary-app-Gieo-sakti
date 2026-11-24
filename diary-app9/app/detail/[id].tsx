import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { editDiary, removeDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

export default function DetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { entries, deleting, saving } = useAppSelector((state) => state.diary);
    const entry = entries.find((item) => String(item.id) === String(id));

    if (!entry) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "#64748B" }}>Diary tidak ditemukan.</Text>
            </View>
        );
    }

    function handleDelete() {
        Alert.alert("Hapus Diary", "Yakin ingin menghapus catatan ini?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Hapus",
                style: "destructive",
                onPress: async () => {
                    try {
                        await dispatch(removeDiary(entry!.id)).unwrap();
                        router.replace("/" as any);
                    } catch (error: any) {
                        Alert.alert("Gagal", error.message || "Gagal menghapus diary");
                    }
                },
            },
        ]);
    }

    return (
        <ScrollView
            style={{ backgroundColor: "#F1F5F9" }}
            contentContainerStyle={styles.container}
        >
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={styles.moodBadge}>
                        <Text style={styles.mood}>{entry.mood || "📝"}</Text>
                    </View>
                    <Pressable
                        style={[
                            styles.favBtn,
                            Boolean(entry.liked) && styles.favBtnActive,
                        ]}
                        disabled={saving}
                        onPress={() =>
                            dispatch(
                                editDiary({
                                    id: entry.id,
                                    data: { liked: !Boolean(entry.liked) },
                                })
                            )
                        }
                    >
                        <Ionicons
                            name={Boolean(entry.liked) ? "heart" : "heart-outline"}
                            size={18}
                            color={Boolean(entry.liked) ? "#EF4444" : "#475569"}
                        />
                        <Text style={styles.favText}>
                            {Boolean(entry.liked) ? "Favorit" : "Jadikan Favorit"}
                        </Text>
                    </Pressable>
                </View>

                <Text style={styles.title}>{entry.title}</Text>

                <View style={styles.metaBox}>
                    <View style={styles.metaRow}>
                        <Ionicons name="calendar-outline" size={15} color="#64748B" />
                        <Text style={styles.metaText}>Tanggal: {entry.diary_date}</Text>
                    </View>
                    {entry.created_at ? (
                        <View style={styles.metaRow}>
                            <Ionicons name="time-outline" size={15} color="#64748B" />
                            <Text style={styles.metaText}>Dibuat: {entry.created_at}</Text>
                        </View>
                    ) : null}
                </View>

                <View style={styles.divider} />
                <Text style={styles.body}>{entry.body}</Text>
            </View>

            <Pressable
                style={styles.editBtn}
                onPress={() =>
                    router.push({
                        pathname: "/edit/[id]",
                        params: { id: String(entry.id) },
                    })
                }
            >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                <Text style={styles.btnText}>Edit Diary</Text>
            </Pressable>

            <Pressable
                style={[styles.deleteBtn, deleting && styles.btnDisabled]}
                onPress={handleDelete}
                disabled={deleting}
            >
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                <Text style={styles.btnText}>
                    {deleting ? "Menghapus..." : "Hapus Diary"}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 18,
        gap: 12,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F5F9",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    moodBadge: {
        width: 58,
        height: 58,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    mood: {
        fontSize: 32,
    },
    favBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    favBtnActive: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA",
    },
    favText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#0F172A",
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#0F172A",
        marginBottom: 10,
    },
    metaBox: {
        gap: 4,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metaText: {
        color: "#64748B",
        fontSize: 13,
    },
    divider: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 14,
    },
    body: {
        fontSize: 16,
        lineHeight: 25,
        color: "#1E293B",
    },
    editBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#0F172A",
        padding: 15,
        borderRadius: 14,
        marginTop: 4,
    },
    deleteBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#DC2626",
        padding: 15,
        borderRadius: 14,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },
});