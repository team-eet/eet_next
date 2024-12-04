import { Provider } from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";

import PageHead from "@/pages/Head";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import EventHead from "@/components/Events/EventHead";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import EventList from "@/components/Events/Events";
import BackToTop from "@/pages/backToTop";

import EventData from "../../../data/events.json";

const EventListPage = () => {
  return (
    <>
      <PageHead title="Event List - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />

          <EventHead />
          <div className="rbt-counterup-area rbt-section-overlayping-top rbt-section-gapBottom">
            <div className="container">
              <EventList
                isPagination={true}
                parentClass="card-list-2 event-list-card"
                childClass="col-lg-6 col-md-6 col-12"
                getEvents={EventData}
              />
            </div>
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default EventListPage;
