
import { useRouter } from "next/router";
import SidebarData from "../../data/dashboard/student/siderbar.json";
import {useEffect, useState} from "react";

const StudentDashboardSidebar = () => {
    const router = useRouter();
    const path = router.pathname;
    const [sFname, setsFname] = useState('')
    const [sLname, setsLname] = useState('')

    useEffect(() => {
        if(localStorage.getItem('userData')) {
            setsFname(DecryptData(localStorage.getItem('userData')).fname)
            setsLname(DecryptData(localStorage.getItem('userData')).lname)
        }
    }, []);
  return (
    <>
      <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
        <div className="inner">
          <div className="content-item-content">
            <div className="rbt-default-sidebar-wrapper">
              <div className="section-title mb--20">
                <h6 className="rbt-title-style-2">Welcome, {sFname} {sLname}</h6>
              </div>
              <nav className="mainmenu-nav">
                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                  {SidebarData && SidebarData.siderbar.map((data, index) => (
                      <li className="nav-item" key={index} role="presentation">
                        <a
                          className={`${path === data.link ? "active" : ""}`}
                          href={data.link}
                        >
                          <i className={data.icon} />
                          <span>{data.text}</span>
                        </a>
                      </li>
                    ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardSidebar;
