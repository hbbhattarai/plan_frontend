import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile'
import VectorTileLayer from "ol/layer/VectorTile";
import MVT from 'ol/format/MVT';
import XYZSource from 'ol/source/XYZ'
import VectorTileSource from 'ol/source/VectorTile';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import * as olProj from 'ol/proj';
import Modal from 'react-modal';
import 'ol/ol.css';
import { defaults as defaultControls, ScaleLine, Control } from 'ol/control';
import { Group as LayerGroup } from 'ol/layer';
import { DragPan, MouseWheelZoom, defaults } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import plotService from "../../../services/plan/plot.service";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { circular } from "ol/geom/Polygon";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { toast } from "react-toastify";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
    transform: 'translate(-50%, -50%)',
  },
};



const Home = () => {
  const mapRef = useRef();
  const [map, setMap] = useState("");
  const [lon, setX] = useState("");
  const [lat, setY] = useState("");
  const [lon1, setX1] = useState("");
  const [lat1, setY1] = useState("");
  const params = useParams();
  const planId = params.plan_id;
  const [plot_gid, setPlotGid] = useState(params.plot_gid);

  const [plotId, setPlot] = useState("");

  // Plot View

  const [max_height, setMaxHeight] = useState("");
  const [plot_id, setPlotId] = useState("");
  const [setback, setSetBack] = useState("");
  const [use, setUse] = useState("");
  const [precinct, setPrecinct] = useState(""); useState("");
  const [coverage, setCoverage] = useState("");
  const [area, setPArea] = useState("")
  const [modalViewPlanIsOpen, setViewPlanIsOpen] = React.useState(false);

  function closeViewPlanModal() {
    setViewPlanIsOpen(false);
  }
  const production_api = process.env.PRODUCTION_API;
  useEffect(() => {

    let selection = {};
    const planboundaryvectorLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: `${production_api}/api/plan-boundary/{z}/{x}/{y}.pbf`,
        tileSize: 3072

      }),
      style: function simpleStyle(feature) {
        if (feature.get('plan_id') === parseInt(planId)) {
          const x = feature.get('x');
          const y = feature.get('y');
          setX(x)
          setY(y)
        }
        if (feature.get("plan_id") === parseInt(planId)) {
          return new Style({
            fill: new Fill({
              color: 'transparent'
            }),
            stroke: new Stroke({
              color: "red",
              width: 2
            }),
            text: new Text({
              text: feature.get('plan'),
            })

          });
        } else {
          return new Style({
            fill: new Fill({
              color: 'transparent'
            }),
            stroke: new Stroke({
              color: "transparent"
            })

          });

        }


      }
    });
    const plotvectorLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: `${production_api}/api/plots/{z}/{x}/{y}.pbf`,
        tileSize: 3072,

      }),
      style: function simpleStyle(feature) {
        if (feature.get('gid') === parseInt(plot_gid)) {
          const x = feature.get('x');
          const y = feature.get('y');
          setX1(x)
          setY1(y)
        }
        if (feature.get("plan_id") === parseInt(planId)) {
          if (feature.get("gid") === parseInt(plot_gid)) {
            return new Style({
              fill: new Fill({
                color: 'red'
              }),
              stroke: new Stroke({
                color: "black",
                width: 2
              }),
              text: new Text({
                text: feature.get('plot_id'),
                placement: 'point',
                textBaseline: 'middle',
                font: 'bold 10px sans-serif'
              })

            });
          } else {
            return new Style({
              fill: new Fill({
                color: feature.get("color")
              }),
              stroke: new Stroke({
                color: 'black',
                width: 1
              }),
              text: new Text({
                text: feature.get('plot_id'),
                placement: 'point',
                textBaseline: 'middle',
              })

            });
          }
        } else {

          return new Style({
            fill: new Fill({
              color: 'transparent'
            }),
            stroke: new Stroke({
              color: "transparent"
            }),

          });

        }


      }
    });
    const roadvectorLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: `${production_api}/api/roads/{z}/{x}/{y}.pbf`,
        tileSize: 3072,

      }),
      style: function simpleStyle(feature) {
        if (feature.get("plan_id") === parseInt(planId)) {
          return new Style({
            stroke: new Stroke({
              color: "#ADACAC",
              width: 4
            }),
            text: new Text({
              text: feature.get('name'),
              placement: 'line',
              textBaseline: 'middle',
              font: 'bold 10px sans-serif'
            })

          });
        } else {
          return new Style({
            fill: new Fill({
              color: 'transparent'
            }),
            stroke: new Stroke({
              color: "transparent"
            })

          });
        }
      }


    });

    const initialMap = new Map({
      target: mapRef.current,
      interactions: defaults({ dragPan: false, mouseWheelZoom: true }).extend([
        new DragPan({
          condition: function (event) {
            return this.getPointerCount() === 1 || platformModifierKeyOnly(event);
          },
        }),
        new MouseWheelZoom({
          condition: platformModifierKeyOnly,
        }),
      ]),
      layers: [
        new TileLayer({
          source: new XYZSource({
            url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            projection: 'EPSG:3857',
          })
        }),
        new LayerGroup({
          layers: [planboundaryvectorLayer]
        }),

        new LayerGroup({
          layers: [plotvectorLayer]
        }),
        new LayerGroup({
          layers: [roadvectorLayer]
        }),
      ],
      controls: defaultControls().extend([new ScaleLine()]),
      view: new View({
        zoom: 9,
        center: olProj.fromLonLat([90.8, 27.41]),
        minZoom: 4,
        maxZoom: 28
      }),

    })
    setMap(initialMap)

    const selectedCountry = new Style({
      stroke: new Stroke({
        color: 'rgba(200,20,20,0.8)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(200,20,20,0.4)',
      }),
    });
    const selectionLayer = new VectorTileLayer({
      map: initialMap,
      renderMode: 'vector',
      source: plotvectorLayer.getSource(),
      style: function (feature) {
        if (feature.get('gid') === selection) {
          return selectedCountry;
        }
      },
    });

    initialMap.on(['click'], function (event) {
      plotvectorLayer.getFeatures(event.pixel).then(function (features) {
        if (!features.length) {
          selection = {};
          return;
        }
        const feature = features[0];
        if (!feature) {
          return;
        }
        if ('singleselect' === 0) {
          selection = {};
        }
        selection = feature.get('gid');
        selectionLayer.changed();
      });
    });


  }, []);
  useEffect(() => {
    if (lon && lat) {
      map.getView().setCenter(olProj.fromLonLat([lon, lat]));
      map.getView().setZoom(16);
      if (lat1 && lon1) {
        map.getView().setCenter(olProj.fromLonLat([lon1, lat1]));
        map.getView().setZoom(18)
      }
      map.on('singleclick', function (event) {
        map.forEachFeatureAtPixel(
          event.pixel,
          function (feature) {
            if (feature.get('layer') === "plots") {
              if (feature.get('plan_id') === parseInt(planId)) {
                setViewPlanIsOpen(true)
                const gid = feature.get('gid');
                setPlotGid(gid)
                const plot_id = feature.get('plot_id');
                setPlotId(plot_id)
                const max_height = feature.get('max_height');
                setMaxHeight(max_height)
                const precinct = feature.get('precinct');
                setPrecinct(precinct)
                const coverage = feature.get('coverage');
                setCoverage(coverage)
                const setback = feature.get('setback');
                setSetBack(setback)
                const uses = feature.get('use');
                setUse(uses)
                const area = feature.get('area');
                setPArea(area)
              }
            }
          },
          {
            hitTolerance: 0,
          }
        );
      });
      ///Locate Button
      const source = new VectorSource();
      const layer = new VectorLayer({
        source: source,
      });
      map.addLayer(layer);
      const locateButton = document.createElement('div');
      locateButton.className = 'ol-control ol-unselectable relative top-20 p-2 crouser-pointer left-2';
      locateButton.innerHTML = '<button>◎</button>';
      locateButton.addEventListener('click', function () {
        navigator.geolocation.watchPosition(
          function (position) {
            const coords = [position.coords.longitude, position.coords.latitude];
            map.getView().setCenter(olProj.fromLonLat([position.coords.longitude, position.coords.latitude]))
            map.getView().setZoom(18)
            const accuracy = circular(coords, position.coords.accuracy);
            source.clear(true);
            const locationFeature = new Feature({ geometry: new Point(olProj.fromLonLat(coords)) });
            locationFeature.setStyle(new Style({
              image: new Icon({
                color: "blue",
                opacity: "0.5",
                crossOrigin: "anonymous",
                src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'
              })
            }))
            const accuracyFeature = new Feature(accuracy.transform('EPSG:4326', map.getView().getProjection()));
            source.addFeature(accuracyFeature);
            source.addFeature(locationFeature);
          },
          function (error) {
            alert(`ERROR: ${error.message} `);
          },
          {
            enableHighAccuracy: true,
          }
        );
      });
      map.addControl(
        new Control({
          element: locateButton
        })
      );

    }
  })
  const handlePlotId = (e) => {
    setPlot(e.target.value);
  };

  const submitPlotID = async (e) => {
    e.preventDefault();
    try {
      if (plotId !== undefined) {
        plotService.getPlotByPlotId(plotId).then((res) => {
          const plot = res.data;
          if (plot.plan_id === planId) {
            setViewPlanIsOpen(true)
            setPlotId(plot.plot_id);
            setPlotGid(plot.gid);
            setMaxHeight(plot.max_height);
          } else {
            toast.error('Plot ID Not Found')
          }
        });
      } else {
        toast.error('Please Enter Plot-ID');
      }

    } catch {
      toast.error('Some Error in sending Request');
    }

  }


  return (
    <>
      <div className="flex font-serif flex-col h-screen overflow-hidden">
        <div className="bg-gray-200 p-2 h-full w-full justify-center flex flex-col overflow-hidden">
          <div className="bg-white md:m-4 h-3/4 md:h-full rounded-lg overflow-hidden rounded-lg">
            <div className="flex flex-col md:flex-row h-full w-full justify-center overflow-hidden">
              <div ref={mapRef} className="w-full md:h-full h-full"> </div>

              <Modal
                isOpen={modalViewPlanIsOpen}
                onRequestClose={closeViewPlanModal}
                style={customStyles}
              >
                <div className="flex justify-around items-center">
                  <div className="w-72 md:w-96 h-full">
                    <div className="md:m-3">
                      <h2 className="text-lg mb-2">Plot DCR
                        <span className="text-xs  text-red-800 font-serif  inline bg-gray-400 rounded-full px-2 py-1 float-right">
                          <button onClick={closeViewPlanModal}>
                            X
                          </button></span></h2>
                    </div>
                    <div className="w-full font-light font-serif text-sm text-gray-700 hover:text-gray-900 transition-all duration-200">
                      <div className="space-y-5 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center bg-gray-500 rounded-xl w-2 h-2 mr-4"
                            >
                            </div>

                            <div>
                              <span className="block"><strong> Plot ID:</strong> {plot_id}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="space-y-5 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center bg-gray-500 rounded-xl w-2 h-2 mr-4"
                            >
                            </div>

                            <div>
                              <span className="block"><strong> Maximum Building Height:</strong> {max_height}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center bg-gray-500 rounded-xl w-2 h-2 mr-4"
                            >
                            </div>

                            <div>
                              <span className="block"><strong>Coverage:</strong> {coverage}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center bg-gray-500 rounded-xl w-2 h-2 mr-4"
                            >
                            </div>

                            <div>
                              <span className="block"><strong>Set Back:</strong> {setback}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center bg-gray-500 rounded-xl w-2 h-2 mr-4"
                            >
                            </div>

                            <div>
                              <span className="block"><strong> Uses :</strong> {use}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center bg-gray-500 rounded-xl w-2 h-2 mr-4"
                            >
                            </div>

                            <div>
                              <span className="block"><strong>Precinct:</strong> {precinct}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5 mt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center bg-gray-500 rounded-xl w-2 h-2 mr-4"
                            >
                            </div>

                            <div>
                              <span className="block"><strong>Area:</strong> {area} Acres</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-y-5 mt-6 justify-center items-center">
                        <a
                          href={`/dashboard/plots/${planId}/${plot_gid}`}
                          className="bg-gray-500 opacity-80 w-42 text-white rounded-full hover:bg-gray-600 px-3 py-2 flex items-center space-x-3"
                        >
                          <span>Zoom To Plot</span>

                          <div className="w-4 h-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path

                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"

                              />
                            </svg>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>

            </div>
          </div>
          <div class="w-full flex justify-center">
            <div className="flex justify-center w-full my-2">
              <form onSubmit={submitPlotID} className="w-3/4 md:w-1/3 block relative">
                <div className="flex flex-row">
                  <input type="text" onChange={handlePlotId} value={plotId} className="relative min-w-0 block w-3/4 px-5 py-4 text-base font-normal text-gray-800 bg-white bg-clip-padding border border-solid border-white rounded transition ease-in-out mr-2 focus:text-gray-800  focus:bg-gray-200  focus:outline-none" placeholder="Search by Plot-ID..." />
                  <button type="submit" className="px-6 py-3 bg-gray-100 bg-opacity-15 text-gray-800  font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center">
                    <svg focusable="false" dataprefix="fas" dataicon="search" className="w-4 text-gray-700" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
        
      </div>
      <ToastContainer autoClose={3000}
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
    </>

  )
}

export default Home
