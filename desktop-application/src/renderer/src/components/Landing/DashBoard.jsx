import React, { useEffect, useState } from 'react'
import { Card, Row } from 'react-bootstrap'
import LineChart from '../LineChart/LineChart'
import PieChart from '../LineChart/PieChart'
import DynamicTable from '../../assets/Custom/DynamicTable'
import DynamicList from '../../assets/Custom/DynamicList'
import { FaClipboardCheck, FaEdit, FaTrashAlt } from 'react-icons/fa'
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import Widget from '../../assets/Custom/Widget'

import CashIcon from '../../assets/Images/Widget/cash-svgrepo-com.svg'
import DeliveryIcon from '../../assets/Images/Widget/delivery-movement-svgrepo-com.svg'
import ManIcon from '../../assets/Images/Widget/man-svgrepo-com.svg'
import calendar from '../../assets/Images/Widget/calendar-svgrepo-com.svg'
import DeliveryBox from '../../assets/Images/Widget/box-svgrepo-com.svg'
import ExpanceIcon from '../../assets/Images/Widget/dollar-square-svgrepo-com.svg'
import moneyRecive from '../../assets/Images/Widget/money-recive-svgrepo-com.svg'

import CButton from '../../assets/Custom/CButton'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { OrdersArray, TodayStats, WeeklySummary } from '../../Store/Store'
import { openNotification, toCommaAndPKR } from '../../assets/Api/Api'
import { Modal, Tag } from 'antd'
import { CiClock2, CiDollar } from 'react-icons/ci'
import { HiMiniMinusCircle } from 'react-icons/hi2'
import { BiSolidDollarCircle } from 'react-icons/bi'
import SmartModal from '../../assets/Custom/SmartModal'
import OrderCompletionForm from '../From/OrderCompletionForm'
import OrdersData from './OrdersData'
import CustomApexChart from '../../assets/Custom/ApexChart/CustomApexChart'

const DashBoard = () => {
  let Nav = useNavigate()
  const { confirm } = Modal

  let [orderData, setOrdersArray] = useRecoilState(OrdersArray)
  let todayStats = useRecoilValue(TodayStats)
  let weeklySummary = useRecoilValue(WeeklySummary)

  const dataSeries = [
    { name: 'Total', data: [31, 150, 28, 51, 42, 109, 100] },
    { name: 'Expanse', data: [11, 32, 45, 32, 34, 52, 41] }
  ]

  const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  let [option, setOption] = useState('Poultry Farm')

  let [widgets, setWidgets] = useState([
    {
      Name: 'Daily Sales',
      value: 1,
      symbol: '#',
      symbolLocation: 'prefix',
      icon: calendar,
      version: 2,
      extra: 'themeGreen'
    },
    {
      Name: 'Daily Delivery',
      value: 11000,
      symbol: 'Rs',
      symbolLocation: 'prefix',
      icon: DeliveryBox,
      version: 2,
      extra: 'themeOrange'
    },
    {
      Name: 'Daily expense',
      value: 10,
      symbol: 'Rs',
      symbolLocation: 'prefix',
      icon: ExpanceIcon,
      version: 2,
      extra: 'DefaultTheme'
    },
    {
      Name: 'Total Sale',
      value: 23,
      symbol: 'Rs',
      symbolLocation: 'prefix',
      icon: moneyRecive,
      version: 2,
      extra: 'DefaultTheme'
    }
  ])

  let headings = [
    { label: 'No#', attribute: 'index' },
    {
      label: 'Date',
      attribute: 'createdAt',
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'UTC'
        })
    },
    { label: 'House Number', attribute: 'houseNumber' },
    { label: 'Phone Number', attribute: 'phoneNumber' },
    {
      label: 'Time',
      attribute: 'createdAt',
      render: (row) =>
        new Date(row.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'UTC'
        })
    },
    {
      label: 'Total',
      attribute: 'total_amount',
      render: (row) => toCommaAndPKR(parseFloat(row.total_amount))
    },

    {
      label: 'Status',
      attribute: 'status',
      render: (row) => {
        const status = row.status?.toLowerCase()

        const statusMap = {
          pending: { color: 'orange', text: 'Pending', icon: <CiClock2 /> },
          complete: {
            color: 'green',
            text: 'Complete',
            icon: <IoIosCheckmarkCircleOutline />
          },
          canceled: {
            color: 'red',
            text: 'Canceled',
            icon: <MdCancel />
          },
          debit: {
            color: 'geekblue',
            text: 'Debited',
            icon: <HiMiniMinusCircle />
          },
          credit: {
            color: 'cyan',
            text: 'Credited',
            icon: <BiSolidDollarCircle />
          }
        }

        const tag = statusMap[status] || { color: 'default', text: status }

        return (
          <Tag
            color={tag.color}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {tag.icon} {tag.text}
          </Tag>
        )
      }
    },
    {
      label: 'Operations',
      attribute: 'Operations',
      options: [
        {
          action: 'edit',
          label: 'Edit',
          icon: <FaEdit />
        },
        {
          action: 'update',
          label: 'Update',
          icon: <FaClipboardCheck />
        }
      ]
    }
  ]

  let TodaysAppointmentHandling = (Heading, row, action) => {
    console.log(Heading, row, action, 'TodaysAppointmentHandling')
  }

  let CallBack = (elem) => {
    // alert(elem);
    setOption(elem)

    switch (elem) {
      case 'Cash Sale':
        //Function to store Data for Walk-In-Customer
        break
      case 'Delivery':
        // Function to Open Delivery Details Module
        break
      case 'IKRAM':
        // Function to store 1 Bottle of IKRAM
        break
      case 'ISLAM':
        // Function to store 1 Bottle of ISLAM
        break

      default:
        console.log('kuch Nahi chala')
        break
    }
  }

  useEffect(() => {
    if (Object.keys(todayStats).length > 0) {
      console.log(todayStats.totalRevenueToday)
      setWidgets([
        {
          Name: 'Daily Sales',
          value: todayStats.totalSalesToday,
          symbol: '#',
          symbolLocation: 'prefix',
          icon: calendar,
          version: 2,
          extra: 'themeGreen'
        },
        {
          Name: 'Daily Delivery',
          value: parseFloat(todayStats.deliveryRevenueToday),
          symbol: 'Rs',
          symbolLocation: 'prefix',
          icon: DeliveryBox,
          version: 2,
          extra: 'themeOrange'
        },
        {
          Name: 'Daily expense',
          value: parseFloat(todayStats.totalExpensesToday || 0),
          symbol: 'Rs',
          symbolLocation: 'prefix',
          icon: ExpanceIcon,
          version: 2,
          extra: 'DefaultTheme'
        },
        {
          Name: 'Total Sale',
          value: parseFloat(todayStats.totalRevenueToday || 0),
          symbol: 'Rs',
          symbolLocation: 'prefix',
          icon: moneyRecive,
          version: 2,
          extra: 'DefaultTheme'
        }
      ])
    }
  }, [todayStats])

  return (
    <div className="container-fluid p-0">
      <Row className="align-items-stretch mb-3">
        <div className="col-md-12">
          <Widget allWidget={widgets} setOption={CallBack} />
        </div>
      </Row>
      <Row className="align-items-stretch">
        <div className="col-md-8">
          <Card className={'shadow'}>
            <CustomApexChart
              series={weeklySummary?.dataSeries || dataSeries}
              categories={weeklySummary?.labels || xLabels}
              type="area"
              height={350}
              showGrid={false}
              showToolbar={false}
              xAxisType="category"
              showXAxis={true}
              showYAxis={true}
              colors={['#36b446', '#1b254b']}
            />
          </Card>
        </div>
        <div className="col-md-4">
          <Card className={'shadow p-3'} style={{ maxHeight: '55vh' }}>
            <h4 className="Head1 mb-4">Account Details</h4>
            <div className="table-responsive">
              <DynamicList
                skipUpTill={4}
                CallBack={TodaysAppointmentHandling}
                headings={headings}
                data={
                  Array.isArray(orderData)
                    ? orderData.filter((item) => {
                        const statusValid = !['complete', 'debit', 'cradit'].includes(item.status)

                        const createdAt = new Date(item.createdAt)
                        const today = new Date()
                        const yesterday = new Date()
                        yesterday.setDate(today.getDate() - 1)

                        const isToday = createdAt.toDateString() === today.toDateString()
                        const isYesterday = createdAt.toDateString() === yesterday.toDateString()

                        return statusValid && (isToday || isYesterday)
                      })
                    : []
                }
                listConcatenationArray={['houseNumber']}
              />
            </div>
          </Card>
        </div>

        <div className="col-md-12 mt-3">
          <OrdersData />
        </div>
      </Row>
    </div>
  )
}

export default DashBoard
