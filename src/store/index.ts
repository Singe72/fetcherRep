"use client";

import { FilteredUser, IReport } from "@/lib/types";
import { create } from "zustand";

type Store = {
    authUser: FilteredUser | null;
    requestLoading: boolean;
    setAuthUser: (user: FilteredUser | null) => void;
    setRequestLoading: (isLoading: boolean) => void;
    reset: () => void;
};

type ReportStore = {
    pageLoading: boolean;
    reports: IReport[];
    report: IReport | null;
    setPageLoading: (loading: boolean) => void;
    modifyReport: (report: IReport) => void;
    setReportList: (reports: IReport[]) => void;
    setReport: (report: IReport) => void;
}

export const useStore = create<Store>((set) => ({
    authUser: null,
    requestLoading: false,
    setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
    setRequestLoading: (isLoading) =>
        set((state) => ({ ...state, requestLoading: isLoading })),
    reset: () => set({ authUser: null, requestLoading: false }),
}));

export const useReportStore = create<ReportStore>((set) => ({
    pageLoading: false,
    reports: [],
    report: null,
    setPageLoading: (loading: boolean) => set((state) => ({...state, pageLoading: loading})),
    modifyReport : (report: IReport) => set((state) =>
        ({...state, reports: [report, ...state.reports.filter((data) => data.report_id != data.report_id)]})),
    setReportList: (reports: IReport[]) => set((state) => ({ ...state, reports: reports})),
    setReport: (report: IReport) => set((state) => ({...state, report: report}))
}));
