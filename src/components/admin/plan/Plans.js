import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"
import Modal from 'react-modal';
import planService from "../../../services/plan/plan.service";
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


const PlanDetailView = () => {
    const [plans, setPlans] = useState("");
    const [modalAddPlanIsOpen, setAddPlanIsOpen] = React.useState(false);
   
    // Plan
    const [plan_name, SetName] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [dzongkhag_id, setDzongkhag] = useState("");
    const [period_from, setPeriodfrom] = useState("");
    const [period_till, setPeriodtill] = useState("");
    const [projected_population, setPPopulation] = useState("");
    const [base_population, setBPopulation] = useState("");
    const [approved_date, setADate] = useState("");
    const [preparation_date, setPDate] = useState("");
    const [datafile, setDataurl] = useState("");
    const [report, setReportUrl] = useState("");
    const [area, setArea] = useState("");

    useEffect(() => {

        planService.getAll().then((res) => {
            const data = res.data.plans;
            setPlans(data);
        });

    }, [])

    // Modal
    function openAddPlanModal() {
        setAddPlanIsOpen(true);
    }
    function closeAddPlanModal() {
        setAddPlanIsOpen(false);
    }

    function deletePlan(id) {
        planService.delete(id).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.msg)
            } else {
                toast.error(res.data.msg)
            }
        })
    }


    // Plan

    const handleName = (e) => {
        SetName(e.target.value);
    };
    const handleType = (e) => {
        setType(e.target.value);

    };
    const handleCategory = (e) => {
        setCategory(e.target.value);

    };

    const handleDzongkhag = (e) => {
        setDzongkhag(e.target.value);

    };

    const handleADate = (e) => {
        setADate(e.target.value);

    };
    const handlePDate = (e) => {
        setPDate(e.target.value);

    };
    const handlePpopulation = (e) => {
        setPPopulation(e.target.value);

    };
    const handleBpopulation = (e) => {
        setBPopulation(e.target.value);

    };
    const handlePeriodfrom = (e) => {
        setPeriodfrom(e.target.value);

    };

    const handlePeriodtill = (e) => {
        setPeriodtill(e.target.value);

    };
    const handleArea = (e) => {
        setArea(e.target.value);

    };
    const handleDataurl = (e) => {
        setDataurl(e.target.files[0]);
    };
    const handleReportUrl = (e) => {
        setReportUrl(e.target.files[0]);
    };

    const submitAddPlanForm = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData;
            data.append("datafile", datafile);
            data.append("plan_name", plan_name);
            data.append("type", type);
            data.append("category", category);
            data.append("dzongkhag_id", dzongkhag_id);
            data.append("period_from", period_from);
            data.append("period_till", period_till);
            data.append("base_population", base_population);
            data.append("projected_population", projected_population);
            data.append("preparation_date", preparation_date);
            data.append("approved_date", approved_date);
            data.append("report", report);
            data.append("area", area);

            planService.create(data).then((res) => {
                if (res.status === 201) {
                    setAddPlanIsOpen(false);
                    toast.success(res.data.msg);

                } else {
                    setAddPlanIsOpen(false);
                    toast.error("Some Error in creating Data");
                }
            })
        } catch (error) {
            setAddPlanIsOpen(false);
            toast.error('Some Error in sending Request to Server');

        }


    }

    return (
        <div className="flex font-serif justify-around bg-gray-100 items-center h-screen" >
            <div className="bg-white bg-opacity-60 h-2/3 m-4 rounded-sm overflow-y-auto">
                <div className="flex justify-between items-center px-6 mx-6  py-3">
                    <h3 className="text-xs text-gray-500">Plans of Bhutan</h3>
                    <button onClick={openAddPlanModal}
                        className="bg-gray-500  text-sm text-white hover:bg-gray-500 flex space-x-3 items-center px-4 py-1 rounded-sm  focus:outline-none"
                    >
                        Add
                    </button>

                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th
                                scope="col"
                                className="px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider "
                            >
                                Sl. No: (Plan ID)
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Type
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Category
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Preparation Date
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Approved Date
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Base Population
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Projected Population
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Area (Acres)
                            </th>
                            <th
                                scope="col"
                                className=" px-6  py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    {plans && (
                        <tbody className="divide-y divide-gray-200">
                            {plans.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {index + 1}  ({item.id})
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.plan_name}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.type}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.category}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.preparation_date}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.approved_date}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.base_population}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.projected_population}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            {item.area}
                                        </th>
                                        <th className="flex gap-2 px-6 py-3 text-left text-xs text-gray-500 font-thin"
                                        >
                                            <button onClick={() => deletePlan(item.id)} className="bg-gray-400  w-30 text-white rounded-sm hover:bg-gray-900 hover:text-white px-2 py-1 flex items-center">
                                                Delete
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
                                            </button>
                                        </th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    )}
                </table>




            </div>

            {/* add Plan */}
            <Modal
                isOpen={modalAddPlanIsOpen}
                onRequestClose={closeAddPlanModal}
                style={customStyles}
            >
                <div className="flex justify-around text-xs items-center">
                    <div className="w-full  h-full flex flex-col overflow-y-auto bg-white">
                        <div className="md:m-3">
                            <h2 className="text-lg mb-2 font-bold "> Add New Plan
                                <span className="text-xs  text-red-800  inline bg-gray-400 rounded-sm px-2 py-1 float-right">
                                    <button onClick={closeAddPlanModal}>
                                        X
                                    </button></span></h2>
                        </div>
                        <div className="w-2/3 mx-auto font-thin text-sm text-gray-700 hover:text-gray-900 transition-all duration-200">

                            <form onSubmit={submitAddPlanForm} enctype='multipart/form-data'>
                                <div className="flex flex-wrap -m-2">
                                    <div className="p-2 w-full">
                                        <div className="relative">
                                            <label
                                                htmlFor="name"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Plan Name
                                            </label>
                                            <input
                                                type="text"
                                                onChange={handleName}
                                                value={plan_name}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="preparation_date"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Preparation Date
                                            </label>
                                            <input
                                                type="text"
                                                onChange={handlePDate}
                                                value={preparation_date}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="approved_date"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Approved Date
                                            </label>
                                            <input
                                                type="text"
                                                onChange={handleADate}
                                                value={approved_date}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label htmlFor="dzongkhag_id" className="leading-7 text-sm text-gray-600">
                                                Dzongkhag
                                            </label>
                                            <select
                                                onChange={handleDzongkhag}
                                                value={dzongkhag_id}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            >
                                                <option>Choose Dzongkhag</option>
                                                <option value="1">Bumthang</option>
                                                <option value="2">Chhukha</option>
                                                <option value="3">Dagana</option>
                                                <option value="4">Gasa</option>
                                                <option value="5">Haa</option>
                                                <option value="6">Lhuentse</option>
                                                <option value="7">Mongar</option>
                                                <option value="8">Paro</option>
                                                <option value="9">Pema Gatshel</option>
                                                <option value="10">Punakha</option>
                                                <option value="11">Samdrup Jongkhar</option>
                                                <option value="12">Samtse</option>
                                                <option value="13">Sarpang</option>
                                                <option value="14">Thimphu</option>
                                                <option value="15">Trashigang</option>
                                                <option value="16">Trongsa</option>
                                                <option value="17">Tsirang</option>
                                                <option value="18">Wangdue Phodrang</option>
                                                <option value="19">Trashi Yangtse</option>
                                                <option value="20">Zhemgang</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label htmlFor="type" className="leading-7 text-sm text-gray-600">
                                                Type
                                            </label>
                                            <select
                                                onChange={handleType}
                                                value={type}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            >
                                                <option>Choose Type</option>
                                                <option value="Regional Plan">Regional Plan</option>
                                                <option value="Valley Development Plan">Valley Development Plan</option>
                                                <option value="Structure Plan">Structure Plan</option>
                                                <option value="Action Area Plan">Action Area Plan</option>
                                                <option value="Local Area Plan">Local Area Plan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label htmlFor="base_population" className="leading-7 text-sm text-gray-600">
                                                Base Population
                                            </label>
                                            <input
                                                type="number"
                                                onChange={handleBpopulation}
                                                value={base_population}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="projected_population"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Projected Population
                                            </label>
                                            <input
                                                type="number"
                                                onChange={handlePpopulation}
                                                value={projected_population}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="Period_from"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Period From (Year)
                                            </label>
                                            <input
                                                type="number"
                                                onChange={handlePeriodfrom}
                                                value={period_from}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="period_till"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Period Till (Year)
                                            </label>
                                            <input
                                                type="text"
                                                onChange={handlePeriodtill}
                                                value={period_till}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label
                                                htmlFor="area"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Area (Acres)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                onChange={handleArea}
                                                value={area}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label htmlFor="category" className="leading-7 text-sm text-gray-600">
                                                Category
                                            </label>
                                            <select
                                                onChange={handleCategory}
                                                value={category}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            >
                                                <option>Choose Category</option>
                                                <option value="Dzongkhag Throm">Dzongkhag Throm</option>
                                                <option value="Yenlag Throm">Yenlag Throm</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="p-2 w-full">
                                        <div className="relative">
                                            <label
                                                htmlFor="datafile"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Attach Data
                                            </label>
                                            <input
                                                type="file"
                                                onChange={handleDataurl}
                                                name={datafile}
                                                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2 w-full">
                                        <div className="relative">
                                            <label
                                                htmlFor="report"
                                                className="leading-7 text-sm text-gray-600"
                                            >
                                                Attach Report
                                            </label>
                                            <input
                                                type="file"
                                                onChange={handleReportUrl}
                                                name={report}
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
    )
}

export default PlanDetailView
