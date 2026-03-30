import React, { useEffect } from "react";
import { useRouter } from "next/router";

const EventLayout = () => {
  const router = useRouter();
  const postId = router.query.eventId;

  useEffect(() => {
    if (postId === undefined) {
      router.push("/pages/event-list");
    }
  }, []);
};

export default EventLayout;
