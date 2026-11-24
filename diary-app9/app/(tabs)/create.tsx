import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { addDiary } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

const MOOD_OPTIONS = ["😊", "🔥", "🥳", "😌", "😢", "😴"];

export default function CreateScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { saving } = useAppSelector((state) => state.diary);

    const [title, setTitle] = useState("");
    const [diaryDate, setDiaryDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [body, setBody] = useState("");
    const [mood, setMood] = useState("😊");

    async function handleSave() {
        if (!title.trim() || !body.trim()) {
            Alert.alert("Validasi", "Judul dan isi diary wajib diisi.");
            return;
        }

        if (title.trim().length < 3) {
            Alert.alert("Validasi", "Judul minimal 3 karakter.");
            return;
        }

        try {
            await dispatch(
                addDiary({
                    title: title.trim(),
                    diary_date: diaryDate,
                    body: body.trim(),
                    mood,
                })
            ).unwrap();

            setTitle("");
            setBody("");
            router.replace("/" as any);
        } catch (error: any) {
            Alert.alert("Gagal", error.message || "Tidak dapat menyimpan diary.");
        }
    }

    return (
        <ScrollView
            style={{ backgroundColor: "#F1F5F9" }}
            contentContainerStyle={styles.container}
        >
            <Text style={styles.heading}>Tambah Diary</Text>
            <Text style={styles.subheading}>Catat momen pentingmu hari ini</Text>

            <Text style={styles.label}>Judul Diary</Text>
            <TextInput
                style={styles.input}
                placeholder="Minimal 3 karakter..."
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Tanggal</Text>
            <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                value={diaryDate}
                onChangeText={setDiaryDate}
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
                placeholder="Tulis ceritamu hari ini..."
                placeholderTextColor="#94A3B8"
                multiline
                value={body}
                onChangeText={setBody}
            />

            <Pressable
                style={[styles.button, saving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={saving}
            >
                <Text style={styles.buttonText}>
                    {saving ? "Menyimpan..." : "Simpan Diary"}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 18,
        paddingTop: 52,
        paddingBottom: 32,
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
        marginBottom: 16,
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