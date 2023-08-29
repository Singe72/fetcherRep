"use client";

import React from "react";
import Image from "next/image";
import useSession from "@/lib/useSession";
import { useStore } from "@/store";
import { apiLogoutUser } from "@/lib/api-requests";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
    const store = useStore();
    const router = useRouter();
    const user = useSession();

    const handleLogout = async () => {
        store.setRequestLoading(true);
        try {
            await apiLogoutUser();
        } catch (error) {
        } finally {
            store.reset();
            router.push("/user/login");
        }
    };

    return (
        <>
            <aside className="aside bg-dark-700">
                <div className="simplebar-wrapper">
                    <div data-pixr-simplebar="">
                        <div className="pb-6 pb-sm-0 position-relative">
                            <div className="cursor-pointer close-menu me-4 text-primary-hover transition-color disable-child-pointer position-absolute end-0 top-0 mt-3 pt-1 d-xl-none">
                                <i className="ri-close-circle-line ri-lg align-middle me-n2"></i>
                            </div>

                            <div className="d-flex justify-content-center align-items-center py-3 px-3">
                                <Link
                                    href={"/"}
                                    className={"m-0"}>
                                    <Image
                                        src={"/assets/images/favicon/logo_transparent.png"} // Route of the image file
                                        width={200} // Desired size with correct aspect ratio
                                        height={100}
                                        alt="Logo"
                                    />
                                </Link>
                            </div>

                            <div className="border-bottom pt-3 pb-5 mb-6 d-flex flex-column align-items-center">
                                <div className="position-relative">
                                    <picture className="avatar avatar-profile">
                                        <Image
                                            src={"https://img.icons8.com/color/96/circled-user-male-skin-type-3--v1.png"} // Route of the image file
                                            className="avatar-profile-img"
                                            width={96}
                                            height={96}
                                            alt="Avatar"
                                        />
                                    </picture>
                                    <span className="dot bg-success avatar-dot"></span>
                                </div>

                                {!user && (
                                    <>
                                        <Link href={"/user/login"} className="btn btn-primary btn-sm mt-2">Login</Link>
                                    </>
                                )}
                                {user && (
                                    <>
                                        <p className="mb-0 mt-3 text-white">{user.user_username}</p>
                                        <small>{user.user_email}</small>
                                        <button onClick={() => handleLogout()} className="btn btn-primary btn-sm mt-2">Logout</button>
                                    </>
                                )}
                            </div>

                            <ul className="list-unstyled mb-6 aside-menu">
                                <li className="menu-section">Menu</li>
                                <li className="menu-item">
                                    <Link
                                        href={"/"}
                                        className={"d-flex align-items-center menu-link"}>
                                        <i className="ri-home-4-line me-3"></i>
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar; 