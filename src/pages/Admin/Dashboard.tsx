import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Dashboard/Layout';
import { PiUsersThreeFill } from 'react-icons/pi';
import { FaArrowsAlt } from 'react-icons/fa';
import { FaCircleQuestion } from 'react-icons/fa6';
import { MdOutlineCategory } from 'react-icons/md';
import { useQuery, useQueryClient } from 'react-query';
import { baseUrl, getRegion, getStaticAll, } from '@/helpers/api/baseUrl';
import { config } from '@/helpers/functions/token';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GetClientAllResponse } from '@/helpers/types/GetClientType';
import { GetStaticsAllResponse } from '@/helpers/types/GetStaticsAllResponse';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/spinner/Spinner';
import { Helmet } from 'react-helmet';
import TableLoading from '@/components/spinner/TableLoading';
import { Pagination } from 'antd';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import CheckLogin from '@/helpers/functions/checkLogin';
import { GetWeekStatic } from '@/helpers/types/GetWeekStatic';
import { GetRegs } from '@/helpers/types/RegionType';
import { AxiosError } from '@/helpers/types/axiosType';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  CheckLogin
  const queryClient = useQueryClient();
  // states
  const [regions, setRegions] = useState<GetRegs[] | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('');
  const totalItems: number | null = 0
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number | null = 10
  const [clientData, setClientData] = useState<GetClientAllResponse[] | null>(null);
  const [allClientData, setAllClientData] = useState<GetClientAllResponse[] | null>(null)
  const [weekData, setWeekData] = useState<GetWeekStatic[] | null>(null)

  // regions get
  const getRegions = useQuery({
    queryKey: ['getRegions', config],
    queryFn: async () => {
      interface GetRegionData {
        body: GetRegs[] | null;
      }
      const res = await axios.get<GetRegionData>(getRegion, config)
      const data = res.data.body
      return data
    },


    onSuccess: (data: GetRegs[]) => {
      setRegions(data)
    }
  })

  useEffect(() => {
    if (getRegions) {
      queryClient.refetchQueries('getRegions')
    }
  }, [getRegions])

  // dashboard statiastic

  const getWeekStatic = useQuery({
    queryKey: ['getWeekStatic', config],
    queryFn: async () => {
      interface GetWeekData {
        body: {
          "dayOfWeek": number | null
          "count": number | null
        }[]
      }
      const res = await axios.get<GetWeekData>(`${baseUrl}statistic/dayOfWeek/`, config);
      const data: GetWeekStatic[] = res.data?.body
      return data;
    },
    onSuccess: (data: GetWeekStatic[]) => {
      setWeekData(data)
    }
  })
  useEffect(() => {
    getWeekStatic.refetch()
  }, [getWeekStatic])
  const dashboardStatic = useQuery({
    queryKey: ['dashboardStatic', config],
    queryFn: async () => {
      interface GetStaticsAllResponse {
        body: {
          categoryCount: number;
          questionCount: number;
          resultCount: number;
          userCount: number;
        };
      }
      const res = await axios.get<GetStaticsAllResponse>(`${getStaticAll}`, config);
      const data = res.data.body
      return data
    },
    onError: (error: AxiosError) => {
      toast.error((error as Error).message);
    },
  });
  useEffect(() => {
    queryClient.refetchQueries('dashboardStatic');
  }, [queryClient]);

  // dashboard static data
  const staticData: GetStaticsAllResponse =
    dashboardStatic.data as GetStaticsAllResponse;
  // console.log(staticData);

  // dashboard region filter
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  // pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // card data
  const cardData = [
    {
      id: 1,
      icon: <MdOutlineCategory />,
      count: dashboardStatic.isLoading ? (
        <div role="status">
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        staticData?.categoryCount
      ),
      label: 'Umumiy Kategoriya',
    },
    {
      id: 2,
      icon: <FaCircleQuestion />,
      count: dashboardStatic.isLoading ? (
        <div role="status">
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        staticData?.questionCount
      ),
      label: 'Umumiy Savol',
    },
    {
      id: 3,
      icon: <FaArrowsAlt />,
      count: dashboardStatic.isLoading ? (
        <div role="status">
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        staticData?.resultCount
      ),
      label: 'Umumiy Natija',
    },
    {
      id: 4,
      icon: <PiUsersThreeFill />,
      count: dashboardStatic.isLoading ? (
        <div role="status">
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        staticData?.userCount
      ),
      label: 'Jami Foydalanuvchilar',
    },
  ];
  // Data Scater
  const data = {
    datasets: [
      {
        label: 'Natijalar soni',
        data: weekData ? weekData.map((item: GetWeekStatic) => (
          { x: item.dayOfWeek, y: item.count }
        )) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };


  const getClientStatic = useQuery({
    queryKey: ['getClient', config],
    queryFn: async () => {
      interface GetClientAllData {
        body: {
          body: GetClientAllResponse[] | null
        }
      }
      const res = await axios.get<GetClientAllData>(`${baseUrl}statistic/filter/?page=${currentPage - 1}&size=${pageSize}`, config);
      const data = res?.data?.body?.body as GetClientAllResponse[] | null;
      return data;
    },
    onSuccess: (data) => {
      setClientData(data);
      setAllClientData(data)
    },
  });

  // Chartjs Options
  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Hafta kunlari',
        },
        ticks: {
          stepSize: 1,
          callback: (tickValue: string | number) => {
            const days = [
              'Dushanba',
              'Seshanba',
              'Chorshanba',
              'Payshanba',
              'Juma',
              'Shanba',
              'Yakshanba',
            ];
            return days[Number(tickValue)];
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
        title: {
          display: true,
          text: 'Savdo soni',
        },
      },
    },
  };

  const navigate = useNavigate();
  const checkRoleClient = useCallback(() => {
    const role = localStorage.getItem('role');
    if (role == 'ROLE_CLIENT') {
      navigate('/client/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    checkRoleClient();
  }, [checkRoleClient]);

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase().trim();

    if (searchValue !== '') {
      const filteredData = allClientData?.filter((event) =>
        (event?.categoryName && event?.categoryName.toLowerCase().includes(searchValue)) ||
        (event.firstName && event.firstName.toLowerCase().includes(searchValue)) ||
        (event.lastName && event.lastName.toLowerCase().includes(searchValue))
      );
      setClientData(filteredData || []);
    } else {
      setClientData(allClientData);
    }
  };


  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Layout>
        {getClientStatic.isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <TableLoading />
          </div>
        ) : (
          (<div className="container mx-auto px-4">
            {/* Cards */}
            <div className="grid mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cardData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 shadow-md flex flex-col items-center text-center"
                >
                  <div className="bg-gray-100 text-3xl p-4 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{item.count}</h2>
                  <p className="text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white shadow rounded-lg flex flex-col p-4 mb-6">
              <div className="flex justify-between items-center mt-8 mb-4 px-6">
                <h2 className="text-blue-500 text-xl font-bold">
                  Haftalik ma'lumot
                </h2>
                <button className="bg-gray-100 px-4 py-2 text-gray-600 rounded-sm">
                  Hafta
                </button>
              </div>
              <div className="w-full h-64 md:h-96 lg:h-[500px]">
                <Scatter data={data} options={options} />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between mb-6">

              <div className="">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative min-w-[400px]">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input type="text" onChange={handleSearchUser} id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 " placeholder="Search branch name..." required />
                </div>
              </div>


              <select
                value={selectedRegion}
                onChange={handleRegionChange}
                className="border p-2 rounded"
              >
                <option value="">Viloyatni tanlang</option>
                {regions && regions.length > 0 && regions.map((region, index) => (
                  <option key={index} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Table Section */}
            <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
              <Table hoverable className="table-fixed w-full border-collapse">
                <TableHead>
                  <TableHeadCell className="w-1/12 text-center">T/P</TableHeadCell>
                  <TableHeadCell className="w-3/12 text-left">Ism</TableHeadCell>
                  <TableHeadCell className="w-3/12 text-left">Familiya</TableHeadCell>
                  <TableHeadCell className="w-5/12 text-left">Kategoriya</TableHeadCell>
                  <TableHeadCell className="w-5/12 text-left">Natija (to'g'ri javoblar/savollar soni)</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {clientData && clientData.length > 0 ? (
                    clientData.map((item: GetClientAllResponse, index: number) => (
                      <TableRow key={index} className="bg-white">
                        <TableCell className="text-center p-4">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="text-left p-4">{item.firstName}</TableCell>
                        <TableCell className="text-left p-4">{item.lastName}</TableCell>
                        <TableCell className="text-left p-4">{item.categoryName}</TableCell>
                        <TableCell className="text-left p-4">{item.correctAnswers}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Ma'lumotlar topilmadi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>


            <div className="flex justify-end mt-4 px-[20px]">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </div>

          )
        )}
      </Layout>
    </div>
  );
};

export default Dashboard;
