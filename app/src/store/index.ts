"use client";

import {FilteredUser, INotification, IReport} from "@/lib/types";
import { create } from "zustand";
import notifications from "@/components/notification/Notifications";

type Store = {
    authUser: FilteredUser | null;
    requestLoading: boolean;
    setAuthUser: (user: FilteredUser | null) => void;
    setRequestLoading: (isLoading: boolean) => void;
    reset: () => void;
};

type ReportStore = {
    pageLoading: boolean;
    reports: null | IReport[];
    report: IReport | null;
    setPageLoading: (loading: boolean) => void;
    modifyReport: (report: IReport) => void;
    setReportList: (reports: IReport[]) => void;
    setReport: (report: IReport) => void;
}

type NotificationStore = {
    notifications: null|INotification[];
    setNotificationList: (notifications: INotification[]) => void;
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
    reports: null,
    report: null,
    setPageLoading: (loading: boolean) => set((state) => ({...state, pageLoading: loading})),
    modifyReport : (report: IReport) => set((state) =>
        ({...state, reports: [report, ...state.reports!.filter((data) => data.report_id != data.report_id)]})),
    setReportList: (reports: IReport[]) => set((state) => ({ ...state, reports: reports})),
    setReport: (report: IReport) => set((state) => ({...state, report: report}))
}));

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: null,
    setNotificationList: (notifications: INotification[]) => set((state) => ({ ...state, notifications: notifications})),
}))