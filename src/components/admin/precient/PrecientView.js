import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile'
import VectorTileLayer from "ol/layer/VectorTile";
import MVT from 'ol/format/MVT';
import XYZSource from 'ol/source/XYZ'
import VectorTileSource from 'ol/source/VectorTile';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { DragPan, MouseWheelZoom, defaults } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import Modal from 'react-modal';
import * as olProj from 'ol/proj';
import 'ol/ol.css';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Group as LayerGroup } from 'ol/layer';
import planService from "../../../services/plan/plan.service";
import precinctService from "../../../services/plan/precinct.service";
import { CanvasJSChart } from "canvasjs-react-charts"


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

const Dashboard = () => {
    // Plan Details
    const [plan, SetPlans] = useState("");
    const [chartData, setChartData] = useState("");
    /// Map View
    const mapRef = useRef();
    const [map, setMap] = useState("");
    const [lon, setX] = useState("");
    const [lat, setY] = useState("");
    const [plot_gid] = useState("none");
    const [modalViewPlanIsOpen, setViewPlanIsOpen] = React.useState(false);
    const params = useParams();
    const plandId = params.id;

    // Precinet
    const [precinct, setPrecinct] = useState(false);
    const [description, setPDescription] = useState(false);
    const [area, setPArea] = useState(false);

    function closeViewPlanModal() {
        setViewPlanIsOpen(false);
    }
    useEffect(() => {
        const production_api = process.env.PRODUCTION_API;
        let selection = {};
        const planboundaryvectorLayer = new VectorTileLayer({
            source: new VectorTileSource({
                format: new MVT(),
                url: `${production_api}/api/plan-boundary/{z}/{x}/{y}.pbf`,
                tileSize: 4096

            }),
            style: function simpleStyle(feature) {

                if (feature.get('plan_id') === parseInt(plandId)) {
                    const x = feature.get('x');
                    const y = feature.get('y');
                    setX(x)
                    setY(y)
                }

                if (feature.get("plan_id") === parseInt(plandId)) {
                    return new Style({
                        fill: new Fill({
                            color: 'transparent'
                        }),
                        stroke: new Stroke({
                            color: "red",
                            width: 1
                        }),

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

        const precintvectorLayer = new VectorTileLayer({
            source: new VectorTileSource({
                format: new MVT(),
                url: `${production_api}/api/precincts/{z}/{x}/{y}.pbf`,
                tileSize: 1536
            }),
            style: function simpleStyle(feature) {
                if (feature.get("plan_id") === parseInt(plandId)) {
                    return new Style({
                        fill: new Fill({
                            color: feature.get('color'),
                        }),
                        stroke: new Stroke({
                            color: feature.get('color'),
                            width: 0.1
                        }),
                        text: new Text({
                            text: feature.get('precinct')
                        })

                    });
                } else {
                    return new Style({
                        fill: new Fill({
                            color: "transparent",
                        }),
                        stroke: new Stroke({
                            color: "transparent"
                        }),

                    });

                }


            },

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
                    layers:
                        [planboundaryvectorLayer, precintvectorLayer],
                }),
            ],
            controls: defaultControls().extend([new ScaleLine()]),
            view: new View({
                zoom: 9,
                center: olProj.fromLonLat([90.3, 27.3]),
                minZoom: 2,
                maxZoom: 60
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
            source: precintvectorLayer.getSource(),
            style: function (feature) {
                if (feature.get('gid') === selection) {
                    return selectedCountry;
                }
            },
        });

        initialMap.on(['click'], function (event) {
            precintvectorLayer.getFeatures(event.pixel).then(function (features) {
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

    }, [])



    // Plan Details


    useEffect(() => {

        planService.getById(plandId).then((res) => {
            const data = res.data.plan;
            SetPlans(data)
        });

        precinctService.getByPlanId(plandId).then((res) => {
            const data = res.data;

            let totalArea = 0;
            for (var i = 0, len = data.length; i < len; i++) {
                var dataArray = parseInt(data[i].area);
                totalArea += dataArray
            }
            let chart = [];
            for (var y = 0, len2 = data.length; y < len2; y++) {
                var dataChart = { y: (((parseInt(data[y].area) / totalArea) * 100).toFixed(4)), label: data[y].precinct }
                chart.push(dataChart)
            }
            setChartData(chart)
        })

    }, []);

    useEffect(() => {
        if (lon && lat) {
            map.getView().setCenter(olProj.fromLonLat([lon, lat]));
            map.getView().setZoom(16)
            map.on('singleclick', function (event) {
                map.forEachFeatureAtPixel(
                    event.pixel,
                    function (feature) {
                        if (feature.get('layer') === "precincts") {
                            if (feature.get('plan_id') === parseInt(plandId)) {
                                setViewPlanIsOpen(true)
                                const name = feature.get('precinct');
                                setPrecinct(name)
                                const description = feature.get('details');
                                setPDescription(description)
                                const area = feature.get('area').toFixed(2);
                                setPArea(area)
                            }


                        }
                    },
                    {
                        hitTolerance: 0,
                    }
                );
            });
        }

    })


    const options = {
        theme: "light2",
        height: 230,
        data: [{
            type: "pie",
            indexLabel: `{label}`,
            fontFamily: 'sans-serif',
            dataPoints: chartData
        }]

    }

    return (
        <div className="flex font-serif flex-col md:h-screen overflow-hidden">
            <div class="bg-gray-200 w-full flex justify-center">
                <a href={`/dashboard/precinet/${plan.id}`} class="flex flex-col items-center py-5 px-2 text-gray-700 hover:text-gray-900">
                    <span class="font-bold  text-2xl">{plan.plan_name}</span>
                </a>
            </div>

            <div className="bg-gray-400 p-2 h-full w-full flex md:flex-row flex-col overflow-hidden">

                {/* <div className="bg-white m-4 md:w-2/6 rounded-lg overflow-hidden">
                    Activities
                </div> */}
                <div className="bg-white m-4 md:w-3/4  rounded-lg overflow-hidden rounded-lg">
                    <div className="flex flex-col md:flex-row h-full w-full justify-center overflow-hidden">
                        <div ref={mapRef} className="w-full md:h-full h-96"> </div>
                        <Modal
                            isOpen={modalViewPlanIsOpen}
                            onRequestClose={closeViewPlanModal}
                            style={customStyles}
                        >
                            <div className="flex justify-around items-center">
                                <div className="w-72 md:w-96 h-96">

                                    <div class="md:m-3">
                                        <h2 className="text-lg mb-2">Precinct DCR
                                            <span className="text-xs  text-red-800 font-serif  inline bg-gray-400 rounded-full px-2 py-1 float-right"><button onClick={closeViewPlanModal}>
                                                X
                                            </button></span></h2>
                                    </div>
                                    <div className="w-full font-light font-serif text-sm text-gray-700 hover:text-gray-900 transition-all duration-200">

                                        <div className="space-y-5 mt-6">
                                            <h2 className="text-lg text-center underline"> {precinct} </h2>
                                        </div>
                                        <div className="space-y-5 mt-6">
                                            <p className="p-1"><strong className='underline'>Characterstics:</strong>  {description} </p>
                                        </div>
                                        <div className="space-y-5 mt-6">
                                            <p className="p-1"><strong className='underline'>Area:</strong>  {area}  Acres </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </Modal>

                    </div>
                </div>
                <div className="bg-white flex flex-col m-4 md:w-1/4  rounded-lg overflow-hidden">
                    <h4 className="font-semibold text-lg text-center mb-4">Plan Details</h4>
                        <div className="flex h-auto mb-5 w-full overflow-y-auto">
                            <div className='p-4 text-gray-600'>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500  w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Category :</strong> {plan.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500 w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Type :</strong> {plan.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500 w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Prepared On :</strong> {plan.preparation_date}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500 w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Approved On :</strong> {plan.approved_date}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500 w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Area (Acres) :</strong> {plan.area}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500 w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Base Population :</strong> {plan.base_population}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500 w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Projected Population :</strong> {plan.projected_population}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="space-y-5 mt-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className="flex items-center justify-center bg-gray-500 w-2 h-2 mr-4"
                                            >
                                            </div>

                                            <div>
                                                <span className="font-light"><strong >Period :</strong> {plan.period_from} - {plan.period_till}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="flex h-auto w-full justify-center items-center mb-5">
                            <div className="h-52 w-full overflow-hidden">
                                <CanvasJSChart options={options} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center my-6">
                            <h4 className="font-semibold text-lg text-center mb-4"> Download and View</h4>
                            <div className="flex justify-around gap-6 items-center mb-4">
                                <a
                                    href={`${production_api}/api/${plan.data_url}`}
                                    className="bg-gray-700  w-30 text-white rounded-lg hover:bg-gray-900 hover:text-white px-2 py-1 flex items-center"
                                >
                                    <span>Data</span>

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
                                <a
                                    href={`${production_api}/api/${plan.report_url}`}
                                    className="bg-gray-700  duration-300 w-30 text-white rounded-lg hover:bg-gray-900 hover:text-white px-2 py-1 flex items-center"
                                >
                                    <span>Report</span>

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
                                <a
                                    href={`/dashboard/plots/${plan.id}/${plot_gid}`}
                                    className="bg-gray-700  duration-300 w-30 text-white rounded-lg hover:bg-gray-900 hover:text-white px-2 py-1 flex items-center"
                                >
                                    <span>Plot DCR</span>

                                    <div className="w-4 h-4 ">
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
        </div>

    )
}

export default Dashboard
