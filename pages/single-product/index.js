import React, { useEffect } from "react";
import { useRouter } from "next/router";

const ShopLayout = () => {
  const router = useRouter();
  const postId = router.query.courseId;

  useEffect(() => {
    if (postId === undefined) {
      router.push("/shop");
    }
  }, []);
};

export default ShopLayout;
