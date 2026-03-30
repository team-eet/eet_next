import React from "react";

const Requirements = ({ checkMatchCourses }) => {
  return (
      <>
          <div className="col-lg-12">
              <div className="section-title">
                  <h4 className="rbt-title-style-3 mb--20 text-start">Prerequisites</h4>
              </div>
              <ul className="rbt-list-style-1">
                  {JSON.parse(checkMatchCourses).map((item, innerIndex) => (
                      <li key={innerIndex}>
                          <i className="feather-check"></i>
                          {item.prerequisitename}
                      </li>
                  ))}
              </ul>
          </div>
      </>
  );
};

export default Requirements;
