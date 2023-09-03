"use client";

import React, {useEffect, useState} from "react";
import {INotification, NotificationFetchResponse, StatisticsResponse} from "@/lib/types";
import {apiFetchNotifications, apiGetStatistics, apiReadNotification} from "@/lib/api-requests";
import {date} from "zod";
import toast, {Toaster} from "react-hot-toast";
import {useNotificationStore} from "@/store";

const Notifications = () => {
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

	const formatDate = (date: Date) => {
		return date.getFullYear() + "-" +
			date.getMonth().toString().padStart(2, '0') + "-" +
			date.getDay().toString().padStart(2, '0')  + " " +
			date.getHours().toString().padStart(2, '0')  + ":" +
			date.getMinutes().toString().padStart(2, '0')  + ":" +
			date.getSeconds().toString().padStart(2, '0')
	};

	const readNotification = async (notification_id: number) => {
		await apiReadNotification(notification_id);
		notificationStore.setNotificationList(notificationStore.notifications!.filter((value) => value.notification_id != notification_id));
	}

	if(notificationStore.notifications == null){
		return (
			<>
				<div className="card bg-white mb-4 mt-4">
					<div className={"d-flex justify-content-center align-items-center w-100 h-100 p-4"}>
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				</div>
			</>
		)
	} else if(notificationStore.notifications.length == 0){
		return (
			<>
				<div className="card bg-white mb-4 mt-4">
					<div className={"d-flex justify-content-center align-items-center w-100 h-100 p-4"}>
						<p className={"text-center"}>Pas de nouvelles notifications</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<Toaster />
			{notificationStore.notifications.map(notification => (
				<>
					<div className="d-flex justify-content-start align-items-start p-3 rounded bg-light mb-3">
						<div className="position-relative mt-1">
							<picture className="avatar avatar-sm">
								<span className="material-symbols-outlined" style={{fontSize: "50px"}}>
								  computer
								</span>
							</picture>
						</div>
						<div className="ms-4">
							<p className="fw-bolder mb-1">{notification.notification_name}</p>
							<p className="text-muted small className">{notification.notification_message}</p>
							<div className={"d-flex justify-content-between"}>
								<span className="fs-xs fw-bolder text-muted text-uppercase">
									{formatDate(new Date(notification.notification_date))}
								</span>
								<button
									type={"button"}
									className={"btn btn-sm btn-success"}
									onClick={() => readNotification(notification.notification_id)}>
									<span className="material-symbols-outlined" style={{fontSize: "16px"}}>
										done
									</span>
								</button>
							</div>
						</div>
					</div>
				</>
			))}
		</>
	)
}

export default Notifications;