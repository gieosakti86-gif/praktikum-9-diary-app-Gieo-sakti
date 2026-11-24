import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { editDiary, fetchDiaries } from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { entries, loading, error } = useAppSelector((state) => state.diary);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchDiaries(search));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, search]);

  if (loading && entries.length === 0 && search === "") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F172A" />
        <Text style={styles.mutedText}>Mengambil diary...</Text>
      </View>
    );
  }

  if (error && entries.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={44} color="#DC2626" />
        <Text style={styles.error}>{error}</Text>
        <Pressable
          style={styles.retryBtn}
          onPress={() => dispatch(fetchDiaries(search))}
        >
          <Text style={styles.retryText}>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Buku Harian</Text>
          <Text style={styles.subheading}>
            {entries.length} catatan tersimpan
          </Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari judul atau isi diary..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => dispatch(fetchDiaries(search))}
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
                dispatch(
                  editDiary({
                    id: item.id,
                    data: { liked: !Boolean(item.liked) },
                  })
                )
              }
            >
              <Ionicons
                name={Boolean(item.liked) ? "heart" : "heart-outline"}
                size={24}
                color={Boolean(item.liked) ? "#EF4444" : "#94A3B8"}
              />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="journal-outline" size={42} color="#94A3B8" />
            <Text style={styles.empty}>
              {search ? "Diary tidak ditemukan." : "Belum ada diary."}
            </Text>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
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
  mutedText: {
    color: "#64748B",
  },
  error: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 14,
  },
  retryBtn: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});