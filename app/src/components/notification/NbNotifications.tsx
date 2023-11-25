"use client";

import {useEffect, useState} from "react";
import {INotification} from "@/lib/types";
import {apiFetchNotifications} from "@/lib/api-requests";
import toast from "react-hot-toast";
import {useNotificationStore} from "@/store";

const nbNotifications = () => {
	const notificationStore = useNotificationStore();

	const fetchNotifications = async () => {
		try {
			const notifications = await apiFetchNotifications();

			notificationStore.setNotificationList(notifications.notifications);
		} catch (error: any) {
			toast.error(error.toString());
		}
	};

	useEffect(() => {
		fetchNotifications();
		window.addEventListener("focus", fetchNotifications);
		return () => {
			window.removeEventListener("focus", fetchNotifications);
		};
	}, []);

	if(notificationStore.notifications == null || notificationStore.notifications.length == 0){
		return (<></>);
	}

	return (
		<span className="badge bg-primary text-white position-absolute top-0 end-0">{notificationStore.notifications.length}</span>
	);
}

export default nbNotifications;