import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { editDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

const MOOD_OPTIONS = ["😊", "🔥", "🥳", "😌", "😢", "😴"];

export default function EditScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const { entries, saving } = useAppSelector((state) => state.diary);
    const entry = entries.find((item) => String(item.id) === String(id));

    const [title, setTitle] = useState(entry?.title || "");
    const [diaryDate, setDiaryDate] = useState(entry?.diary_date || "");
    const [body, setBody] = useState(entry?.body || "");
    const [mood, setMood] = useState(entry?.mood || "😊");
    const isSubmittedRef = useRef(false);

    const hasUnsavedChanges = Boolean(
        entry &&
        (title !== entry.title ||
            diaryDate !== entry.diary_date ||
            body !== entry.body ||
            mood !== (entry.mood || ""))
    );

    useEffect(() => {
        const unsubscribe = (navigation as any).addListener(
            "beforeRemove",
            (e: any) => {
                if (!hasUnsavedChanges || isSubmittedRef.current) {
                    return;
                }

                e.preventDefault();
                Alert.alert(
                    "Batalkan Perubahan?",
                    "Perubahan yang belum disimpan akan hilang. Yakin ingin keluar?",
                    [
                        { text: "Tetap di Sini", style: "cancel" },
                        {
                            text: "Keluar",
                            style: "destructive",
                            onPress: () => navigation.dispatch(e.data.action),
                        },
                    ]
                );
            }
        );

        return unsubscribe;
    }, [navigation, hasUnsavedChanges]);

    if (!entry) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "#64748B" }}>Diary tidak ditemukan.</Text>
            </View>
        );
    }

    async function handleUpdate() {
        if (!title.trim() || !body.trim()) {
            Alert.alert("Validasi", "Judul dan isi wajib diisi.");
            return;
        }

        if (title.trim().length < 3) {
            Alert.alert("Validasi", "Judul minimal 3 karakter.");
            return;
        }

        try {
            await dispatch(
                editDiary({
                    id: entry!.id,
                    data: {
                        title: title.trim(),
                        diary_date: diaryDate,
                        body: body.trim(),
                        mood,
                    },
                })
            ).unwrap();

            isSubmittedRef.current = true;
            router.back();
        } catch (error: any) {
            Alert.alert("Gagal", error.message || "Gagal memperbarui diary");
        }
    }

    return (
        <ScrollView
            style={{ backgroundColor: "#F1F5F9" }}
            contentContainerStyle={styles.container}
        >
            <Text style={styles.label}>Judul Diary</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Judul diary (min. 3 karakter)"
                placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Tanggal</Text>
            <TextInput
                style={styles.input}
                value={diaryDate}
                onChangeText={setDiaryDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>Pilih Mood</Text>
            <View style={styles.moodRow}>
                {MOOD_OPTIONS.map((item) => (
                    <Pressable
                        key={item}
                        style={[styles.moodChip, mood === item && styles.moodChipActive]}
                        onPress={() => setMood(item)}
                    >
                        <Text style={styles.moodText}>{item}</Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.label}>Isi Catatan</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                value={body}
                onChangeText={setBody}
                placeholder="Isi diary"
                placeholderTextColor="#94A3B8"
            />

            <Pressable
                style={[styles.button, saving && styles.buttonDisabled]}
                onPress={handleUpdate}
                disabled={saving}
            >
                <Text style={styles.buttonText}>
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 18,
        paddingBottom: 32,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F5F9",
    },
    label: {
        fontSize: 13,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 13,
        fontSize: 15,
        color: "#0F172A",
    },
    moodRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    moodChip: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    moodChipActive: {
        borderColor: "#0F172A",
        backgroundColor: "#E2E8F0",
    },
    moodText: {
        fontSize: 22,
    },
    textArea: {
        minHeight: 140,
        textAlignVertical: "top",
    },
    button: {
        backgroundColor: "#0F172A",
        padding: 15,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },
});