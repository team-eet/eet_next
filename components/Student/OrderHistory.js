import { useEffect, useState } from "react";
import Axios from 'axios';
import { API_URL, API_KEY } from "../../constants/constant";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import logo from "@/public/images/logo/eetlogo 1.svg";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);       // grouped by payment_id
  const [loading, setLoading] = useState(true);
  const [getUserData, setUserData] = useState({});
  const [downloadingId, setDownloadingId] = useState(null); // tracks which invoice is downloading

  const formatDate = (value, opts = { day: '2-digit', month: '2-digit', year: 'numeric', hour12: true }) => {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-GB', opts).format(new Date(value));
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      console.warn("No userData found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const udata = DecryptData(userData);
      if (!udata?.regid) {
        console.error("regid not found in user data");
        setLoading(false);
        return;
      }
      setUserData(udata);

      // Use the same working endpoint pattern from CourseSuccessFile
      Axios.get(`${API_URL}/api/cart/GetCartCourseDone/${udata['regid']}`, {
        headers: { ApiKey: API_KEY }
      })
          .then(res => {
            console.log("Raw API Response:", res.data); // <--- ADD THIS
            if (Array.isArray(res.data) && res.data.length > 0) {
              // Group items by their orderId / payment_id so each row = one transaction
              const grouped = {};
              res.data.forEach(item => {
                console.log("Raw API Response:", res.data); // <--- ADD THIS
                const key = item.orderId || item.payment_id || item.sOID;
                if (!grouped[key]) {
                  grouped[key] = {
                    orderId: item.orderId || item.sOID || '',
                    payment_id: item.payment_id || '',
                    payment_method: item.payment_method || item.paymentMode || '-',
                    payment_status: item.payment_status || 'captured',
                    txnAmount: item.txnAmount || item.txnAmount || '0',
                    txnDate: item.txnDate || item.dCreatedDate2 || '',
                    purchaseDate: item.dCreatedDate2 || item.txnDate || '',
                    items: []
                  };
                }
                grouped[key].items.push(item);
              });
              console.log("Final Grouped Orders:", Object.values(grouped));
              setOrders(Object.values(grouped));
            } else {
              setOrders([]);
            }
            setLoading(false);
          })
          .catch(err => {
            console.error("Status:", err.response?.status);
            console.error("Full error:", err.response?.data);
            console.error("URL called:", `${API_URL}/api/cart/GetCartCourseDone/${udata['regid']}`);
            setLoading(false);
          });
    } catch (e) {
      console.error("Decryption Error:", e);
      setLoading(false);
    }
  }, []);

  // ---------- Invoice PDF Download (same logic as CourseSuccessFile) ----------
  const downloadInvoice = (order) => {
    setDownloadingId(order.orderId);
    const invoiceEl = document.getElementById(`invoice-${order.orderId}`);

    html2canvas(invoiceEl, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const ratio = canvas.width / canvas.height;
      const pdfWidth = pageWidth - 20;
      const pdfHeight = pdfWidth / ratio;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save(`invoice_${order.payment_id || order.orderId}.pdf`);
      setDownloadingId(null);
    });
  };

  // ---------- Inline invoice template (hidden, used for PDF capture) ----------
  const InvoiceTemplate = ({ order }) => {
    let cartTotal = 0;
    order.items.forEach(item => {
      const price = item.pcId !== 0 ? parseInt(item.dDiscount || "0") : parseInt(item.cnewamt || item.txnAmount || "0");
      cartTotal += price;
    });
    const baseAmount = (cartTotal / (1 + 18 / 100)).toFixed(2);
    const gstAmount = (cartTotal - parseFloat(baseAmount)).toFixed(2);

    return (
        <div
            id={`invoice-${order.orderId}`}
            style={{
              position: 'absolute',
              top: '-9999px',
              left: '-9999px',
              width: '794px',
              background: '#fff',
              padding: '40px',
              fontFamily: 'sans-serif',
              fontSize: '14px',
              color: '#333'
            }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Image src={logo} width={137} height={45} alt="EET English" />
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ margin: 0 }}>INVOICE</h4>
              <span>Date: {formatDate(new Date())}</span>
            </div>
          </div>
          <hr />

          {/* Addresses */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <div>
              <h5 style={{ marginBottom: '6px' }}>Company Address</h5>
              <address style={{ margin: 0, lineHeight: '1.6' }}>
                Urjanagar 1, near Reliance<br />
                Cross Road in Kudasan<br />
                Gandhinagar, Gujarat, India
              </address>
              <span>info@eet.english.com</span>

              <div style={{ marginTop: '20px' }}>
                <h5 style={{ marginBottom: '6px' }}>Bill To</h5>
                <span><b>Name: </b>{getUserData.fname} {getUserData.lname}</span><br />
                <span><b>Customer Id: </b>{getUserData.uuid}</span><br />
                <span><b>Purchase Date: </b>{formatDate(order.purchaseDate)}</span>
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: '6px' }}>Transaction Details</h5>
              <span><b>Order Id: </b>{order.orderId}</span><br />
              <span><b>Payment Id: </b>{order.payment_id}</span><br />
              <span><b>Payment Method: </b>{order.payment_method}</span><br />
              <span><b>Payment Status: </b>
                {order.payment_status === 'captured' ? 'Success'
                    : order.payment_status === 'refunded' ? 'Refunded'
                        : order.payment_status === 'failed' ? 'Failed'
                            : order.payment_status}
                        </span><br />
              <span><b>Amount: </b>₹{order.txnAmount}</span>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
            <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>#</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Product</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Amount</th>
            </tr>
            </thead>
            <tbody>
            {order.items.map((item, i) => {
              const finalPrice = item.pcId !== 0
                  ? parseInt(item.dDiscount || "0")
                  : parseInt(item.cnewamt || item.txnAmount || "0");
              return (
                  <tr key={i}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{i + 1}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {item.cname || item.sCourseTitle}
                      <br />
                      <small style={{ color: '#666' }}>By {item.fname} {item.lname}</small>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{finalPrice}</td>
                  </tr>
              );
            })}
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 600 }}>Base Amount</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{baseAmount}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 600 }}>GST Amount (18%)</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{gstAmount}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 600 }}>Paid Amount</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{order.txnAmount}</td>
            </tr>
            </tbody>
          </table>
        </div>
    );
  };

  // ---------- Render ----------
  return (
      <>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box" style={{ padding: '25px' }}>
          <div className="content">
            <div className="section-title">
              <h4 className="rbt-title-style-3">Order History</h4>
            </div>

            <div className="rbt-dashboard-table table-responsive mobile-table-750">
              <table className="rbt-table table table-borderless">
                <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Course(s)</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <i className="fa fa-spinner fa-spin"></i> Loading orders...
                      </td>
                    </tr>
                ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No orders found.
                      </td>
                    </tr>
                ) : (
                    orders.map((order, index) => (
                        <tr key={index}>
                          <th>{order.orderId}</th>
                          <td>
                            {order.items.map((item, i) => (
                                <div key={i}>
                                  {item.cname || item.sCourseTitle}
                                  {i < order.items.length - 1 && <hr className="my-1" />}
                                </div>
                            ))}
                          </td>
                          <td>{formatDate(order.txnDate)}</td>
                          <td>₹{order.txnAmount}</td>
                          <td>{order.payment_method || '-'}</td>
                          <td>
                                                <span className={`badge ${
                                                    order.payment_status === 'captured' ? 'bg-success'
                                                        : order.payment_status === 'failed' ? 'bg-danger'
                                                            : order.payment_status === 'refunded' ? 'bg-warning'
                                                                : 'bg-secondary'
                                                }`}>
                                                    {order.payment_status === 'captured' ? 'Success'
                                                        : order.payment_status === 'refunded' ? 'Refunded'
                                                            : order.payment_status === 'failed' ? 'Failed'
                                                                : order.payment_status || '-'}
                                                </span>
                          </td>
                          <td className="d-flex gap-2">
                            <a
                                className="btn btn-outline-primary btn-sm"
                                href={`/student/student-receipt/${EncryptData(order.orderId)}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                              Receipt
                            </a>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => downloadInvoice(order)}
                                disabled={downloadingId === order.orderId}
                            >
                              {downloadingId === order.orderId ? (
                                  <><i className="fa fa-spinner fa-spin"></i> Downloading...</>
                              ) : 'Invoice'}
                            </button>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hidden invoice templates for PDF generation */}
        {orders.map((order, i) => (
            <InvoiceTemplate key={i} order={order} />
        ))}
      </>
  );
};

export default OrderHistory;