import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const AccountSidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
      <>
        <div className="rbt-my-account-tab-button nav" role="tablist">
          <Link href="#dashboad" className="nav-link active" data-bs-toggle="tab">
            Dashboard
          </Link>
          <Link href="#orders" className="nav-link" data-bs-toggle="tab">
            Orders
          </Link>
          <Link href="#download" className="nav-link" data-bs-toggle="tab">
            Download
          </Link>
          <Link href="#payment-method" className="nav-link" data-bs-toggle="tab">
            Payment Method
          </Link>
          <Link href="#address-edit" className="nav-link" data-bs-toggle="tab">
            Address
          </Link>
          <Link href="#account-info" className="nav-link" data-bs-toggle="tab">
            Account Details
          </Link>

          {/* Added nav-link class here to match the others */}
          <a className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Logout
          </a>
        </div>
      </>
  );
};

export default AccountSidebar;