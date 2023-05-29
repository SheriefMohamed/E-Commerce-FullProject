import React, {Fragment, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {MDBDataTable} from 'mdbreact'

import MetaData from '../layouts/meta_data'
import Loader from '../layouts/loader'
import Sidebar from './sidebar'

import {useAlert} from 'react-alert'
import {useDispatch, useSelector} from 'react-redux'
import {allOrders, clearErrors} from '../../actions/order_actions'
import {DELETE_ORDER_RESET} from "../../consts/order_consts";
import {deleteOrder} from "../../actions/order_actions";

const OrdersList = ({history}) => {
    const Alert = useAlert();
    const dispatch = useDispatch();

    const {loading, error, orders} = useSelector(state => state.allOrders);
    const { isDeleted } = useSelector(state => state.order)

    useEffect(() => {
        dispatch(allOrders());

        if (error) {
            Alert.error(error);
            dispatch(clearErrors)
        }
        if (isDeleted) {
            Alert.success('Order deleted successfully');
            history.push('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET })
        }


    }, [dispatch, Alert, error, history,isDeleted]);
    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
    }
    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'No of Items',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }
        orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{color: 'green'}}>{order.orderStatus}</p>
                    : <p style={{color: 'red'}}>{order.orderStatus}</p>,
                actions: <Fragment>
                    <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-eye"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteOrderHandler(order._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })
        return data;

    }
    return (
        <Fragment>
            <MetaData title={'All Orders'}/>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar/>
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Orders</h1>

                        {loading ? <Loader/> : (
                            <MDBDataTable
                                data={setOrders()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
};

export default OrdersList;