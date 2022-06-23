import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import planService from "../../../services/plan/plan.service";
import precinctService from "../../../services/plan/precinct.service";
import { CanvasJSChart } from "canvasjs-react-charts"
import activityService from '../../../services/plan/activity.service';
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
    const [activities, SetActivity] = useState("");
    const [chartData, setChartData] = useState("");
    /// Map View
    const params = useParams();
    const plandId = params.id;
    const [plot_gid] = useState("none");


    useEffect(() => {

        planService.getById(plandId).then((res) => {
            const data = res.data.plan;
            SetPlans(data)
        });


        activityService.getByPlanId(plandId).then((res) => {
            const data = res.data.activities;
            console.log(data)
            SetActivity(data)
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
                <a href={`/dashboard/precinet/${plan.id}`} class="flex flex-col items-center py-5 p-4 text-gray-700 hover:text-gray-900">
                    <span class="font-bold  text-2xl">{plan.plan_name}</span>
                </a>
            </div>

            <div className="bg-gray-400 p-2 h-full w-full flex md:flex-row flex-col overflow-hidden">

    
                <div className="bg-white m-4 md:w-3/4  rounded-lg overflow-hidden rounded-lg">
                    <div className="flex flex-col  h-full w-full overflow-hidden">
                        <div className="w-full flex justify-between flex-row p-2 border-b-2 border-gray-500">
                            <h4 className="font-semibold  text-2xl text-center "> Activities</h4>
                           

                        </div>
                        {activities && (


                            < div class="flex flex-col md:h-full h-96 overflow-y-auto">
                                {activities.map((item, index) => {
                                    return (
                                        <div class="p-4" key={index}>
                                            <h1 class="text-center text-lg  my-3 lg:mt-4">{item.phase}</h1>
                                            <p class="text-sm mb-4"><strong>Description :</strong> {item.description}</p>
                                            <p class="text-sm mb-2">  <strong> Estimated Budget: </strong> Nu. {item.estd_budget} millions </p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white flex flex-col m-4 md:w-2/4  rounded-lg overflow-hidden">
                    <h4 className="font-semibold text-2xl text-center my-3 border-b-2 border-gray-500">Plan Details</h4>
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
                        <div className="flex justify-around gap-2 items-center mb-4">
                            <a
                                href={`http://localhost:5000/api/${plan.data_url}`}
                                className="bg-gray-700  text-white rounded-lg hover:bg-gray-900 hover:text-white px-2 py-1 flex items-center"
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
                                href={`http://localhost:5000/api/${plan.report_url}`}
                                className="bg-gray-700  text-white rounded-lg hover:bg-gray-900 hover:text-white px-2 py-1 flex items-center"
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
                                className="bg-gray-700   text-white rounded-lg hover:bg-gray-900 hover:text-white px-2 py-1 flex items-center"
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
