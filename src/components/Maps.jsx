import React, { useMemo, useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import "./css/maps.css";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "react-select";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import bluecircle from "../bluecircle.png";
import Drawer from "./MapsComponents/Drawer";
import { database } from "../base";
import { ref, onValue } from "firebase/database";
import busicon from "./MapsComponents/bus 100 100.png";
import moment from "moment";

const Maps = () => {
  const [destination, setDestination] = useState();
  const [destinationResponse, setDestinationResponse] = useState();
  const [userLoc, setUserLoc] = useState();
  const [drawerOpen, setdrawerOpen] = useState(false);
  const [center, setcenter] = useState();
  const [busDataTemp, setbusDataTemp] = useState();
  const [busData, setbusData] = useState();
  const [activeMarker, setActiveMarker] = useState(null);
  const [route, setRoute] = useState({ result: null, ishidden: true });
  const [libraries] = useState(["places"]);
  const [currentBusDetails, setCurrentBusDetails] = useState();
  const [currentBusRoute, setCurrentBusRoute] = useState();

  const [ourText, setOurText] = useState("");
  const msg = new SpeechSynthesisUtterance();

  const speechHandler = (msg) => {
    msg.text = ourText;
    window.speechSynthesis.speak(msg);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const defaultMapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  };

  var watchID;
  var geoLoc;

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  function showLocation(position) {
    setUserLoc({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    // setUserLoc({
    //   lat: 18.455354,
    //   lng: 73.858597,
    // });
  }

  function errorHandler(err) {
    if (err.code === 1) {
      console.log("Error: Access is denied!");
    } else if (err.code === 2) {
      console.log("Error: Position is unavailable!");
    }
  }
  function getLocationUpdate() {
    if (navigator.geolocation) {
      // timeout at 60000 milliseconds (60 seconds)
      var options = { timeout: 1000 };
      geoLoc = navigator.geolocation;
      watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    } else {
      console.log("Sorry, browser does not support geolocation!");
    }
  }

  //   useEffect(() => {
  //     getLocationUpdate();
  //   }, []);
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      function (position) {
        // setUserLoc({
        //   lat: 18.455354,
        //   lng: 73.858597,
        // });
        setUserLoc({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      errorHandler,
      { timeout: 500 }
    );
  }

  useEffect(() => {
    const busesRef = ref(database, "buses/");
    onValue(busesRef, (snapshot) => {
      const data = snapshot.val();
      setbusDataTemp(data);
      // if()
    });
  }, []);

  useEffect(() => {
        setbusData(busDataTemp);
  }, [busDataTemp]);

  const getRoute = async () => {
    setRoute((val) => ({ ...val, ishidden: false }));
  };

  const removeRoute = async () => {
    setRoute((val) => ({ ...val, ishidden: true }));
  };

  const centern = useMemo(() => ({ lat: 18.4807627, lng: 73.8724301 }), []);
  async function handleClick() {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const tempval = currentBusRoute.legs[0].steps.forEach((val) => {
      if (val.travel_mode === "TRANSIT") {
        return val.transit.arrival_stop.name;
      }
    });
    const result = await directionsService.route({
      origin: {lat:busData.latitude, lng:busData.longitude},
      destination: tempval,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives: true,
    });
    setCurrentBusDetails({ distance: result, ishidden: true });
  }
  console.log(currentBusDetails);
  return (
    <>
      <div className="maps-main-body">
        <div className="maps-body-gmap">
          {!isLoaded || !Boolean(userLoc) ? (
            <div className="loading">
              <CircularProgress />
            </div>
          ) : (
            <GoogleMap
              zoom={13}
              // center={centern}
              center={center ? center : userLoc}
              options={defaultMapOptions}
              mapContainerClassName="gmap"
              onClick={() => setActiveMarker(null)}
            >
              {/* <Marker position={{ lat: 18.530298, lng: 73.849171 }} /> */}
              {busData &&
                Object.values(busData).map((val, i) => (
                  <Marker
                    position={{
                      lat: parseFloat(val.latitude),
                      lng: parseFloat(val.longitude),
                    }}
                    icon={busicon}
                    key={i}
                    onClick={() => handleActiveMarker(i)}
                  >
                    {activeMarker === i && (
                      <InfoWindow
                        onCloseClick={() => {
                          setActiveMarker(null);
                        }}
                      >
                        <div>Updated: {moment(val.timestamp).fromNow()}</div>
                      </InfoWindow>
                    )}
                  </Marker>
                ))}
              {destination && <Marker position={destination} />}
              {userLoc && <Marker position={userLoc} icon={bluecircle} />}
              {!route.ishidden && (
                <DirectionsRenderer directions={route.result} />
              )}
            </GoogleMap>
          )}
        </div>
        <div className="maps-body">
          <div className="maps-search-field">
            {!isLoaded ? (
              <></>
            ) : (
              <PlacesAutoComplete
                setDestination={setDestination}
                setCenter={setcenter}
                setDestinationResponse={setDestinationResponse}
                setRoute={setRoute}
                setCurrentBusRoute={setCurrentBusRoute}
                userLoc={userLoc}
                destination={destination}
              />
            )}
          </div>
          <div className="latlngtry">
            <button onClick={handleClick}> Main </button>
            {/* Latitude: {userLoc?.lat} <br /> Longitude: {userLoc?.lng} <br /> */}
            {/* <button onClick={getRoute}>Go</button> */}
          </div>
        </div>
        <div className="maps-body-drawer">
          <Drawer
            data={destinationResponse}
            drawerOpen={drawerOpen}
            setdrawerOpen={setdrawerOpen}
            route={route.result}
            isNotRoute={route.ishidden}
            getRoute={getRoute}
            removeRoute={removeRoute}
            speechHandler={speechHandler}
            setOurText={setOurText}
            msg={msg}
          />
        </div>
      </div>
    </>
  );
};

const PlacesAutoComplete = ({
  setDestination,
  setCenter,
  setDestinationResponse,
  setRoute,
  userLoc,
  setCurrentBusRoute,
  destination,
}) => {
  const [options, setoptions] = useState();
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    setoptions(
      data.map(({ description, place_id }) => ({
        label: description,
        value: place_id,
      }))
    );
  }, [data]);

  const handleSelect = async (val) => {
    clearSuggestions();
    const results = await getGeocode({ address: val.label });
    const { lat, lng } = await getLatLng(results[0]);
    await setDestination({ lat, lng });
    // await setCenter({ lat, lng });
    await setDestinationResponse(results);

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: userLoc,
      destination: { lat, lng },
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives: true,
    });
    setRoute({ result: result, ishidden: true });
    setCurrentBusRoute(result.routes[0]);
  };
  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        name="color"
        styles={{ width: "100px" }}
        options={options}
        onInputChange={(val) => setValue(val)}
        onChange={handleSelect}
      />
    </>
  );
};

export default Maps;
