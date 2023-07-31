import React, { useEffect, useState } from 'react';
import CartOrderHeader from '../components/CartOrderHead.js';
import copyIcon from '../assets/icon/copy.png';
import '../styles/pages/Order.css';
import RESTapi from './../config/services/RESTapi';

function OrderList(props) {
  const order = props.orderData;
  const orderStatus = props.orderStatus;
  const isSelected = props.orderData === props.orderDetail;
  const setOrderDetail = props.setOrderDetail;

  return (
    <div
      className={`orderList${isSelected ? ' isSelected' : ''}`}
      onClick={() => setOrderDetail(order)}
    >
      <div className="dateHCol">
        <div className="create_date">
          {new Date(order.created_at).toLocaleDateString('en-GB')}
        </div>
        <div className="order_id">{order._id}</div>
      </div>
      <div className="statusHCol">
        <div className="statusHHead">STATUS:</div>
        <div className="statusHValue">
          {orderStatus.find((stage) => stage._id === order.status_id)
            ?.stage_name || 'Stage Not Found'}
        </div>
      </div>
    </div>
  );
}

function OrderDetail(props) {
  const order = props.orderDetail;
  const orderStatusList = props.orderStatus;
  function renderTimeLine(stage) {
    const stageNum =
      parseInt(orderStatusList?.findIndex((item) => item._id === stage)) + 1;
    const maxStage = orderStatusList.length - 3;
    let circleElements = [];
    for (let i = 1; i <= maxStage; i++) {
      let isStage = stageNum >= i ? 'currentStage' : '';
      let lineAfterClass = stageNum >= i + 1 ? 'currentStage' : '';
      circleElements.push(
        <div className={`circleRow col${i}`} key={`circleRow col${i}`}>
          {i === 1 ? null : <div className={`lineBefore ${isStage}`} />}
          <div className={`circleTimeLine ${isStage}`} />
          {i === 6 ? null : <div className={`lineAfter ${lineAfterClass}`} />}
        </div>
      );
    }
    return circleElements;
  }

  function renderReviewProductList(items) {
    function renderOption(option) {
      if (!option) {
        return;
      }
      const options = [];
      for (const key in option) {
        options.push(
          <div className={`option notLetMidify`} key={key}>
            {option[key][0]}
          </div>
        );
      }
      return options;
    }

    return items.map((item, index) => (
      <div className="reviewProductRow" key={index}>
        <div className="productCol">
          <div className="productPhotoBox inReview">
            <img
              src={item.property.product_photo}
              alt={item.property.product_name}
            />
          </div>
          <div className="nameOptionBox">
            <div className="productName inReview">
              {item.property.product_name}
            </div>
            <div className="optionBox">
              {renderOption(item.property.option)}
            </div>
          </div>
        </div>
        <div className="priceCol">฿{item.property.product_price}</div>
        <div className="quantityCol">
          <div className="numAmount inReview">
            <div>{item.property.quantity}</div>
          </div>
        </div>
        <div className="totalCol">฿{item.property.totalPrice}</div>
      </div>
    ));
  }

  return (
    <div className="orderDetailBox">
      <div className="orderHeadLine">
        <h1>Order Detail</h1>
        <div className="orderDetail">
          <div className="orderIDCol">
            <h2 className="orderIDHead">ID</h2>
            <div className="orderIDValue">{order._id}</div>
          </div>
          <div className="dateCol">
            <h2 className="dateHead">Date</h2>
            <div className="dateValue">
              {new Date(order.created_at).toLocaleDateString('en-GB')}
            </div>
          </div>
          <div className="statusCol">
            <h2 className="statusHead">STATUS</h2>
            <div className="statusValue">
              {orderStatusList?.find((stage) => stage._id === order.status_id)
                ?.stage_name || 'Stage Not Found'}
            </div>
          </div>
        </div>
      </div>
      <div className="orderTimeLine">
        <div className="gridTimeLine">
          <div className="orderPlaceStage col1">
            <div className="nameTimeLine">
              <div>Order</div>
              <div>Place</div>
            </div>
          </div>
          <div className="orderConfirmStage col2">
            <div className="nameTimeLine">
              <div>Order</div>
              <div>Confirm</div>
            </div>
          </div>
          <div className="paymentConfirmStage col3">
            <div className="nameTimeLine">
              <div>Payment</div>
              <div>Confirm</div>
            </div>
          </div>
          <div className="packedStage col4">
            <div className="nameTimeLine">
              <div>Packed</div>
            </div>
          </div>
          <div className="shippingStage col5">
            <div className="nameTimeLine">
              <div>Shipping</div>
              <div className="expressName">BBadExpress</div>
              <div className="trackNum">
                EF582621151TH
                <img className="copyIcon" src={copyIcon} alt="copy" />
              </div>
            </div>
          </div>
          <div className="deleveredStage col6">
            <div className="nameTimeLine">
              <div>Delivered</div>
            </div>
          </div>
          {renderTimeLine(order.status_id)}
        </div>
      </div>
      <div className="addressOrderSumLine">
        <div className="addressContainer">
          <h2 className="addressHead">CONTACT ADDRESS</h2>
          <div className="realNameBox">{order.contact_info.real_name}</div>
          <div className="phoneBox">{order.contact_info.phone}</div>
          <div className="addressBox">
            {order.contact_info.address.adress1 +
              ' ' +
              order.contact_info.address.adress2 +
              ' ' +
              order.contact_info.address.district +
              ' ' +
              order.contact_info.address.province +
              ' ' +
              order.contact_info.address.postcode +
              ' '}
          </div>
        </div>
        <div className="orderSumContainer">
          <h2 className="orderSumHead">ORDER SUMMARY</h2>
          <div className="orderSumBox">
            <div className="orderSumLine">
              <div className="orderSumName">subtotal</div>
              <div className="orderSumValue">฿{order.summary.subtotal}</div>
            </div>
            {Object.entries(order.summary.priceChange).map(([key, value]) =>
              value !== 0 ? (
                <div key={key} className="orderSumLine">
                  <div className="orderSumName">{key}</div>
                  <div className="orderSumValue">฿{value}</div>
                </div>
              ) : null
            )}
            <div className="orderSumLine netLine">
              <div className="orderSumName">NET</div>
              <div className="orderSumValue">฿{order.summary.net}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="thisOrderCartLine">
        <h2 className="thisOrderHead">ORDER CART</h2>
        <div className="thisOrderBox">
          <div className="reviewProductHeadLine">
            <div>PRODUCT</div>
            <div>PRICE</div>
            <div>QUANTITY</div>
            <div>TOTAL</div>
          </div>
          <div className="reviewProductList">
            <div className="reviewProductListContent">
              {renderReviewProductList(order.items)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Order() {
  const [orderData, setOrderData] = useState({});
  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const responseGetOrder = await RESTapi.getOrders();
        const responseGetOrderStatus = await RESTapi.getOrderStatus();

        if (
          responseGetOrder.getOrder &&
          responseGetOrderStatus.getOrderStatus
        ) {
          let reOrderList = responseGetOrder.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setOrderData({
            orderList: reOrderList,
            orderStatus: responseGetOrderStatus.data,
          });
          setOrderDetail(reOrderList[0]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  if (orderData === {} || orderDetail === {}) {
    return <div>loading....</div>;
  } else {
    return (
      <div className="order">
        <CartOrderHeader nowPage="OrderPage" />
        <div className="contentContainer">
          <div className="orderPage">
            <div className="orderListContainer">
              <div className="orderHeadLine">
                <h1>Order History</h1>
                {orderData === {} || orderData.orderList === undefined ? (
                  <div>loading....</div>
                ) : (
                  orderData.orderList.map((order) => (
                    <OrderList
                      orderData={order}
                      orderStatus={orderData.orderStatus}
                      orderDetail={orderDetail}
                      setOrderDetail={setOrderDetail}
                      key={order._id}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="orderDetailContainer">
              {orderDetail === {} || orderData.orderStatus === undefined ? (
                <div>loading....</div>
              ) : (
                <OrderDetail
                  orderDetail={orderDetail}
                  orderStatus={orderData.orderStatus}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
