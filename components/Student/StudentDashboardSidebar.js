import { useRouter } from "next/router";
import SidebarData from "../../data/dashboard/student/siderbar.json";
import { DecryptData } from "@/components/Services/encrypt-decrypt";
import { useEffect, useState } from "react";

const StudentDashboardSidebar = () => {
    const router = useRouter();
    const path = router.pathname;
    const [sFname, setFname] = useState('')
    const [sLname, setLname] = useState('')
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    useEffect(() => {
        if (localStorage.getItem('userData')) {
            setFname(DecryptData(localStorage.getItem('userData')).fname)
            setLname(DecryptData(localStorage.getItem('userData')).lname)
        }
    }, []);

    return (
        <>
            <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
                <div className="inner">
                    <div className="section-title mb--20">
                        <h6 className="rbt-title-style-2">Welcome, {sFname} {sLname}</h6>
                    </div>
                    <nav className="mainmenu-nav">
                        <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                            {SidebarData && SidebarData.siderbar.map((data, index) => (
                                <li className="nav-item" key={index} role="presentation">
                                    {data.text === 'Logout' ? (
                                        <a style={{ cursor: 'pointer' }} onClick={() => setShowLogoutModal(true)}>
                                            <i className={data.icon} />
                                            <span>{data.text}</span>
                                        </a>
                                    ) : (
                                        <a className={`${path === data.link ? "active" : ""}`} href={data.link}>
                                            <i className={data.icon} />
                                            <span>{data.text}</span>
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            {showLogoutModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '12px',
                        padding: '30px', textAlign: 'center', minWidth: '300px'
                    }}>
                        <h5 style={{ marginBottom: '10px' }}>Logout</h5>
                        <p style={{ marginBottom: '20px' }}>Are you sure you want to logout?</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={confirmLogout}
                                style={{
                                    padding: '8px 24px', backgroundColor: '#e74c3c',
                                    color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'
                                }}>
                                Yes
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                style={{
                                    padding: '8px 24px', backgroundColor: '#6c757d',
                                    color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'
                                }}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentDashboardSidebar;