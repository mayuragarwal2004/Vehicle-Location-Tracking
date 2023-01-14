import React, { useEffect } from "react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
const Drawer = ({
  data,
  setdrawerOpen,
  drawerOpen,
  route,
  isNotRoute,
  getRoute,
  removeRoute,
  speechHandler,
  setOurText,
  msg
}) => {
  const busStop = {lat:123, lng:123};
  
  return (
    <div
      className={
        drawerOpen
          ? "map-drawer map-drawer-visible"
          : "map-drawer map-drawer-visible"
      }
    >
      <div className="map-drawer-head">
        <div className="puller" onClick={() => setdrawerOpen((val) => !val)} />
        {data && (
          <div className="map-drawer-title">
            {!data
              ? "Search for an area"
              : data[0].address_components[0].long_name}
            {route && (
              <div>
                <DirectionsBusIcon /> {route.routes[0].legs[0].distance.text}
                {"   "}
                {route.routes[0].legs[0].duration.text}
                {"   "}
                {route.routes[0].fare.text}
              </div>
            )}
            <div className="drawer-goto-buttons">
              {route && (
                <button
                  onClick={isNotRoute ? getRoute : removeRoute}
                  className="directions-button"
                >
                  {isNotRoute ? "Directions" : "X"}
                </button>
              )}
              {route && (
                <button className="start-journey" onClick={()=>{setOurText(route.routes[0].legs[0].steps[0].instructions); speechHandler(msg)}}>Start Journey</button>
              )}
            </div>
          </div>
        )}
      </div>
      {drawerOpen && (
        <div className="map-drawer-body">
          {route.routes[0].legs[0].steps.map((step) => (
            <>
              <div className="drawer-cards-main">
                <div className="drawer-cards-left">
                  {step.travel_mode === "WALKING" ? (
                    <DirectionsWalkIcon />
                  ) : (
                    <>
                      <div className="bus-num">{step.transit.line.short_name}</div>
                      <DirectionsBusIcon />
                    </>
                  )}
                  <div>{step.distance.text}</div>
                </div>
                <div className="drawer-cards-right">
                  <div className="drawer-cards-right-instructions">{step.instructions}</div>
                  <div className="drawer-cards-right-instructions">{step?.transit?.arrival_time.text}</div>
                </div>
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drawer;
