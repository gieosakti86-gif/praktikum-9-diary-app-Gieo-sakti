import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    apiCreateDiary,
    apiDeleteDiary,
    apiGetDiaries,
    apiUpdateDiary,
    DiaryEntry,
    NewDiary,
} from "../../services/diaryApi";

type DiaryState = {
    entries: DiaryEntry[];
    loading: boolean;
    saving: boolean;
    deleting: boolean;
    error: string | null;
};

const initialState: DiaryState = {
    entries: [],
    loading: false,
    saving: false,
    deleting: false,
    error: null,
};

export const fetchDiaries = createAsyncThunk<DiaryEntry[], string | undefined>(
    "diary/fetchDiaries",
    async (search) => {
        return await apiGetDiaries(search);
    }
);

export const addDiary = createAsyncThunk(
    "diary/addDiary",
    async (data: NewDiary) => {
        return await apiCreateDiary(data);
    }
);

export const editDiary = createAsyncThunk(
    "diary/editDiary",
    async ({ id, data }: { id: number; data: Partial<DiaryEntry> }) => {
        return await apiUpdateDiary(id, data);
    }
);

export const removeDiary = createAsyncThunk(
    "diary/removeDiary",
    async (id: number) => {
        await apiDeleteDiary(id);
        return id;
    }
);

const diarySlice = createSlice({
    name: "diary",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiaries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiaries.fulfilled, (state, action) => {
                state.loading = false;
                state.entries = action.payload;
            })
            .addCase(fetchDiaries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Gagal memuat diary";
            })
            .addCase(addDiary.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(addDiary.fulfilled, (state, action) => {
                state.saving = false;
                state.entries.unshift(action.payload);
            })
            .addCase(addDiary.rejected, (state, action) => {
                state.saving = false;
                state.error = action.error.message || "Gagal menambah diary";
            })
            .addCase(editDiary.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(editDiary.fulfilled, (state, action) => {
                state.saving = false;
                const idx = state.entries.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.entries[idx] = action.payload;
            })
            .addCase(editDiary.rejected, (state, action) => {
                state.saving = false;
                state.error = action.error.message || "Gagal memperbarui diary";
            })
            .addCase(removeDiary.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(removeDiary.fulfilled, (state, action) => {
                state.deleting = false;
                state.entries = state.entries.filter((i) => i.id !== action.payload);
            })
            .addCase(removeDiary.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.error.message || "Gagal menghapus diary";
            });
    },
});

export default diarySlice.reducer;