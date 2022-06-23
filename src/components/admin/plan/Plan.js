import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify"
import planService from "../../../services/plan/plan.service";
import precinctService from "../../../services/plan/precinct.service";
import { CanvasJSChart } from "canvasjs-react-charts"
import Modal from 'react-modal';
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

    const [phase, SetPhase] = useState("");
    const [description, SetDescription] = useState("");
    const [estd_budget, SetBudget] = useState("");
    // Modal

    const [modalAddIsOpen, setAddIsOpen] = React.useState(false);

    function openAddModal() {
        setAddIsOpen(true);
    }
    function closeAddModal() {
        setAddIsOpen(false);
    }


    const handlePhase = (e) => {
        SetPhase(e.target.value);
    };

    const handleDescription = (e) => {
        SetDescription(e.target.value);
    };

    const handleBudget = (e) => {
        SetBudget(e.target.value);
    };


    const submitActivityForm = async (e) => {
        e.preventDefault();
        try {
            const data = {
                "phase": phase,
                "plan_id": parseInt(plandId),
                "description": description,
                "estd_budget": estd_budget,
            }

            console.log(data)
            activityService.create(data).then((res) => {
                if (res.status === 201) {


                    setAddIsOpen(false);
                    toast.success(res.data.msg);

                } else {
                    setAddIsOpen(false);
                    toast.error("Some Error in creating Data");
                }
            })
        } catch (error) {
            setAddIsOpen(false);
            toast.error('Some Error in sending Request to Server');

        }


    }

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

                {/* <div className="bg-white m-4 md:w-2/6 rounded-lg overflow-hidden">
                    Activities
                </div> */}
                <div className="bg-white m-4 md:w-3/4  rounded-lg overflow-hidden rounded-lg">
                    <div className="flex flex-col  h-full w-full overflow-hidden">
                        <div className="w-full flex justify-between flex-row p-2 border-b-2 border-gray-500">
                            <h4 className="font-semibold  text-2xl text-center "> Activities</h4>
                            <button onClick={openAddModal}
                                className="bg-gray-700  w-30 text-white rounded-lg hover:bg-gray-900 hover:text-white p-4 py-1 flex items-center"
                            >
                                <span>Add</span>
                            </button>

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
                {/* add Plan */}
                <Modal
                    isOpen={modalAddIsOpen}
                    onRequestClose={closeAddModal}
                    style={customStyles}
                >
                    <div className="flex justify-around text-xs items-center">
                        <div className="w-full  h-full flex flex-col overflow-y-auto bg-white">
                            <div className="md:m-3">
                                <h2 className="text-lg mb-2 font-bold "> Add New Activity
                                    <span className="text-xs  text-red-800  inline bg-gray-400 rounded-sm p-4 py-1 float-right">
                                        <button onClick={closeAddModal}>
                                            X
                                        </button></span></h2>
                            </div>
                            <div className="w-2/3 mx-auto font-thin text-sm text-gray-700 hover:text-gray-900 transition-all duration-200">

                                <form onSubmit={submitActivityForm} enctype='multipart/form-data'>
                                    <div className="flex flex-wrap -m-2">
                                        <div className="p-2 w-full">
                                            <div className="relative">
                                                <label
                                                    htmlFor="phase"
                                                    className="leading-7 text-sm text-gray-600"
                                                >
                                                    Phase
                                                </label>
                                                <input
                                                    type="text"
                                                    onChange={handlePhase}
                                                    value={phase}
                                                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-2 w-full">
                                            <div className="relative">
                                                <label
                                                    htmlFor="description"
                                                    className="leading-7 text-sm text-gray-600"
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    type="text"
                                                    step="any"
                                                    onChange={handleDescription}
                                                    value={description}
                                                    rows="8"
                                                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                                > </textarea>
                                            </div>
                                        </div>
                                        <div className="p-2 w-full">
                                            <div className="relative">
                                                <label
                                                    htmlFor="estd_budget"
                                                    className="leading-7 text-sm text-gray-600"
                                                >
                                                    Estimated Budget (Millions)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    onChange={handleBudget}
                                                    value={estd_budget}
                                                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-2 w-full">
                                            <button type="submit" className="flex mx-auto  text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div >

    )
}

export default Dashboard
