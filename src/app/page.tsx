import { prisma } from "@/lib/prisma";
import Synchronisation from "@/components/Synchronisation";
import ReportList from "@/components/ReportList";

import Script from "next/script";
import ModifyReport from "@/components/ModifyReport";

export default async function Home() {
  function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  let query;

  query = await prisma.report.aggregate({
    _count: {
      report_id: true
    }
  });

  const nbReport = numberWithSpaces(query._count.report_id);

  query = await prisma.report.aggregate({
    _count: {
      report_id: true
    },
    where: {
      report_state: "new"
    }
  });

  const nbNewReport = numberWithSpaces(query._count.report_id);

  query = await prisma.report.findMany({
    distinct: ['report_program'],
    select: {
      report_program: true,
    },
  });

  const nbPrograms = numberWithSpaces(query.length);

  query = await prisma.report.findMany({
    select: {
      report_reward: true,
    },
    orderBy: {
      report_reward: "desc"
    },
    take: 1
  });


  const maxReward = (query.length == 0 || query[0].report_reward! == null) ? 0 : numberWithSpaces(query[0].report_reward!);

  query = await prisma.report.findMany({
    where: {
      report_state: "new"
    },
    take: 50
  });

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

          <div className={"d-flex flex-wrap justify-content-around align-items-center gap-5"}>
            <div className="card card-info mb-4">
              <div className="card-header justify-content-between align-items-center d-flex">
                <h4 className="card-title fw-bold m-0">Saved reports</h4>
              </div>
              <div className="card-body px-4 pb-2 pt-0">
                <h5>
                  <span className={"badge bg-primary badge-pill"}>{nbReport}</span>
                </h5>
              </div>
            </div>

            <div className="card card-info mb-4">
              <div className="card-header justify-content-between align-items-center d-flex">
                <h4 className="card-title fw-bold m-0">New reports</h4>
              </div>
              <div className="card-body px-4 pb-2 pt-0">
                <h5>
                  <span className={"badge bg-primary badge-pill"}>{nbNewReport}</span>
                </h5>
              </div>
            </div>

            <div className="card card-info mb-4">
              <div className="card-header justify-content-between align-items-center d-flex">
                <h4 className="card-title fw-bold m-0">Programs</h4>
              </div>
              <div className="card-body px-4 pb-2 pt-0">
                <h5>
                  <span className={"badge bg-primary badge-pill"}>{nbPrograms}</span>
                </h5>
              </div>
            </div>

            <div className="card card-info mb-4">
              <div className="card-header justify-content-between align-items-center d-flex">
                <h4 className="card-title fw-bold m-0">Max Reward</h4>
              </div>
              <div className="card-body px-4 pb-2 pt-0">
                <h5>
                  <span className={"badge bg-primary badge-pill"}>{maxReward}$</span>
                </h5>
              </div>
            </div>
          </div>

          <div className="card mb-4 mt-4">
            <div className="card-header justify-content-between align-items-center d-flex">
              <h6 className="card-title m-0">Reports</h6>
              <Synchronisation />
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                <tr>
                  <th scope="col">New?</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Program</th>
                  <th scope="col">Title</th>
                  <th scope="col">Reward</th>
                  <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                  <ReportList />
                </tbody>
              </table>
            </div>
          </div>

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
