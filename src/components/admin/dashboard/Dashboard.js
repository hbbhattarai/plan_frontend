import React, { useEffect, useRef, useState } from "react";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile'
import VectorTileLayer from "ol/layer/VectorTile";
import MVT from 'ol/format/MVT';
import XYZSource from 'ol/source/XYZ'
import VectorTileSource from 'ol/source/VectorTile';
import { Fill, Stroke, Style, Text } from 'ol/style';
import * as olProj from 'ol/proj';
import 'ol/ol.css';
import { DragPan, MouseWheelZoom, defaults } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import { defaults as defaultControls } from 'ol/control';
import { Group as LayerGroup } from 'ol/layer';
import { CanvasJSChart } from "canvasjs-react-charts";
import LogoImage from "../../../assets/logo.png";
import planService from "../../../services/plan/plan.service";



const Home = () => {
  const mapRef = useRef("");
  const [showSidebar, setShowSidebar] = useState(false);

  const [chartData, setChartData] = useState("");
  const [chartData2, setChartData2] = useState("");
  const [map, setMap] = useState();
  const [dzongkhag, setDzongkhag] = useState("");
  const [dzongkhagsplans, setDzongkhagsPlans] = useState("");
  const [plans, setPlans] = useState("");
  useEffect(() => {
    let selection = {};
    const dzongkahgboundaryvectorLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: `http://localhost:5000/api/dzongkhag-boundary/{z}/{x}/{y}.pbf`,
      }),
      style: function simpleStyle(feature) {
        if (feature.get("layers") === "dzongkhag_boundaries") {
          return new Style({
            fill: new Fill({
              color: feature.get('color')
            }),
            stroke: new Stroke({
              color: "black",
              width: "0.1"
            }),
            text: new Text({
              text: feature.get('name'),
              placement: 'point',
            })
          });
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
            attribution:' Develop By Hem Bdr. Bhattarai'
           
          })
        }),
        new LayerGroup({
          layers: [dzongkahgboundaryvectorLayer]
        }),
      ],
      controls: defaultControls(),
      view: new View({
        zoom: 9,
        center: olProj.fromLonLat([90.7, 27.45]),
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
      source: dzongkahgboundaryvectorLayer.getSource(),
      style: function (feature) {
        if (feature.get('dzo_id') === selection) {
          return selectedCountry;
        }
      },
    });

    initialMap.on(['click'], function (event) {
      dzongkahgboundaryvectorLayer.getFeatures(event.pixel).then(function (features) {
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
        selection = feature.get('dzo_id');
        selectionLayer.changed();
      });
    });
  }, []);



  useEffect(() => {
    planService.getAll().then((res) => {
      const data = res.data.plans;
      setPlans(data);

      let totalArea = 0;
      for (var i = 0, len = data.length; i < len; i++) {
        var dataArray = data[i].area;
        totalArea += dataArray
      }


      let chart = [];
      for (var y = 0, len2 = data.length; y < len2; y++) {
        var dataChart = { y: (((data[y].area / totalArea) * 100).toFixed(2)), label: data[y].plan_name }
        chart.push(dataChart)
      }
      setChartData(chart)
    })

  }, []);

  useEffect(() => {
    if (map) {
      map.on('singleclick', function (event) {
        map.forEachFeatureAtPixel(
          event.pixel,
          function (feature) {
            if (feature.get('layers') === "dzongkhag_boundaries") {
              const Id = feature.get('dzo_id');
              const name = feature.get('name');
              setDzongkhag(name);
              if (Id) {
                setShowSidebar(true);
                planService.getByDzongkhagId(Id).then((res) => {
                  const data = res.data.plans;
                  setDzongkhagsPlans(data)
                  let totalArea = 0;
                  for (var i = 0, len = data.length; i < len; i++) {
                    var dataArray = data[i].area;
                    totalArea += dataArray
                  }
                  let chart2 = [];
                  for (var y = 0, len2 = data.length; y < len2; y++) {
                    var dataChart2 = { y: ((data[y].area / totalArea) * 100).toFixed(1), label: data[y].plan_name }
                    chart2.push(dataChart2)
                  }

                  setChartData2(chart2)

                })
              }
            }
          },
          {
            hitTolerance: 0,
          }
        );
      });
    }

  });

  const pie = {
    theme: "light2",
    height: 280,
    dataPointMaxWidth: 40,
    data: [
      {
        type: "pie",
        dataPoints: chartData2
      },
    ]
  }

  const doughnut = {
    animationEnabled: true,
    theme: "light2",
    height: 180,
    data: [{
      type: "doughnut",
      dataPoints: chartData
    }]

  }

  return (

    <div className="bg-gray-400 flex font-serif flex-col md:h-screen overflow-hidden">


      <div className="p-2 h-full w-full flex md:flex-row flex-col overflow-hidden">
        <div className="bg-white m-4 md:w-1/4  rounded-lg overflow-hidden">
          <div className="flex h-full flex-col ">
            <div class="w-full flex mb-1 justify-center border-b-2 border-gray-500">
              <a href="/dashboard" class="flex flex-col items-center text-gray-900 hover:text-gray-900">
                <img src={LogoImage} className="h-20 w-auto p-1" alt="DHS" />
                <span class="font-bold text-center text-2xl"> DHS | Plan Inventory System </span>
              </a>
            </div>
          
            <div className="flex md:h-3/5 h-72 w-full overflow-y-auto">
              <table class="min-w-full leading-normal">
                {plans && (
                  <tbody className="flex flex-col justify-center items-center">
                    {plans.map((item, index) => {
                      return (

                        <tr key={index}
                          class="border-t text-xs flex p-1 md:p-3 hover:bg-gray-100 md:table-row flex-col w-full flex-wrap">

                          <td class="flex flex-roww bg-white  w-full">
                            <label class=" text-gray-500 Capitalize font-semibold mx-4 ">Plan Name : </label>
                            <p class="text-gray-600 whitespace-no-wrap">  {item.plan_name}</p>


                          </td>
                          <td class="flex flex-roww bg-white  w-full">
                            <label class="text-gray-500 Capitalize font-semibold mx-4 ">Areas in acres :</label>
                            <p class="text-gray-900 whitespace-no-wrap"> {item.area}</p>

                          </td>
                          <td class="flex flex-row bg-white w-full">
                            <label class="text-gray-500 Capitalize font-semibold mx-4">Approved Date :</label>
                            <p class="text-gray-900 whitespace-no-wrap"> {item.approved_date}</p>

                          </td>

                          <td class="flex justify-end bg-white  w-full">

                            <a href={`/plan/${item.id}`} className="bg-gray-500 h-8 text-center opacity-80  text-white rounded-sm hover:bg-gray-100 hover:text-gray-800 px-2 py-1 flex items-center">View</a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                )}
              </table>
            </div>
            <div className="flex  my-1 w-full justify-center items-center">
              <a href="/dashboard/plans" className="bg-gray-500 h-8 w-28 text-center opacity-80  text-white rounded-sm hover:bg-gray-100 hover:text-gray-800 px-2 py-1 flex items-center">View Plans</a>
            </div>
            <div className="flex flex-col h-1/5  w-full justify-center items-center">
              <h1 className="text-gay-400 font-semibold my-1">Planned Area in Percent(%) </h1>
              <div className="h-52 w-full overflow-hidden">
                <CanvasJSChart options={doughnut} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white m-4 md:w-3/4  rounded-lg overflow-hidden rounded-lg">
          <div className="flex flex-col md:flex-row h-full w-full justify-center overflow-hidden">
            <div ref={mapRef} className="w-full md:h-full h-96"> </div>
            <div className={showSidebar ? "top-0 right-0  w-full md:w-1/3 px-6 py-2  text-gray-900 relative h-full translate-x-0 z-60 my-2  ease-in-out duration-800" : 'translate-x-full'}>

              {dzongkhagsplans && (
                <>
                  <h1 className="text-gray-600 font-semibold">Plans Under {dzongkhag} Dzongkhag</h1>

                  <div className="h-2/4 py-1 overflow-y-auto">
                    {dzongkhagsplans.map((item, index) => {

                      return (
                        <div className="md:flex py-1 space-y-1 md:space-y-2 md:space-x-5 rounded-sm lg:space-x-10 mt-4 px-2 font-thin">
                          <div key={index} className="w-full border-b-1 border-gray-200 bg-gray-100 rounded-lg  p-4 space-y-1">
                            <h3 className="text-lg font-semibold">
                              <a href={`/dashboard/precinet/${item.id}`} >{item.plan_name}</a>
                            </h3>
                            <div className="text-sm font-thin m-0 p-0">
                              <p>Category: {item.category}</p>
                              <p>Type: {item.type}</p>
                            </div>

                            <div className="flex justify-end my-6 items-center">
                              <a
                                href={`/dashboard/precinet/${item.id}`}
                                className="bg-gray-500 opacity-80 px-2 py-1 text-white rounded-sm  hover:bg-gray-100 hover:text-gray-800  flex items-center space-x-3"
                              >
                                <span>Precinet DCR</span>

                                <div className="w-4 h-4 animate-pulse">
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
                      )
                    })}
                  </div>
                  <div className="h-2/4 flex flex-col justify-around items-center my-6">
                    <div className="flex flex-col justify-around items-center mt-2">
                      <h1 className="text-gay-600 font-semibold mb-4">Planned Under {dzongkhag} Dzongkhag in Percent(%) </h1>

                      <div className="h-72 w-full overflow-hidden">
                        <CanvasJSChart options={pie} />
                      </div>
                    </div>
                  </div>

                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
