import { prisma } from "@/lib/prisma";
import ReportList from "@/components/ReportList";

import Script from "next/script";
import React from "react";
import Statistics from "@/components/Statistics";

export default async function Home() {
  return (
      <>
        <section className="container-fluid">
          <nav className="mb-4 pb-2 border-bottom" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#"><i className="ri-home-line align-bottom me-1"></i> Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Home</li>
            </ol>
          </nav>

          <h2 className="fs-4 mb-2">Home</h2>

          <Statistics />

          <ReportList />

          <footer className="footer">
            <p className="small text-muted m-0">All rights reserved | Lucas Martinelle © 2023</p>
            <p className="small text-muted m-0">Template created by <a href="https://www.pixelrocket.store/">PixelRocket</a></p>
          </footer>

          <div className="menu-overlay-bg"></div>

          <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNotifications"
               aria-labelledby="offcanvasNotificationsLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNotificationsLabel">Notifications</h5>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <a href="#" className="btn btn-outline-secondary w-100 mt-4" role="button">View all notifications</a>
            </div>
          </div>
        </section>

        <Script
            type={"text/javascript"}
            src={"assets/js/theme.bundle.js"}
            strategy="lazyOnload"></Script>
        <Script
            type={"text/javascript"}
            src={"assets/js/vendor.bundle.js"}
            strategy="lazyOnload"></Script>
      </>
  )
}
