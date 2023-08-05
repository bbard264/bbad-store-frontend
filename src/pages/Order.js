import React, { useEffect, useState } from 'react';
import { useMediaContext } from '../config/services/MediaContext';
import CartOrderHeader from '../components/CartOrderHead.js';
import copyIcon from '../assets/icon/copy.png';
import hamburgerMenuIcon from '../assets/icon/menus.png';
import '../styles/pages/Order.css';
import RESTapi from './../config/services/RESTapi';
import xIcon from '../assets/icon/x-mark.png';

function OrderList({
  orderData,
  orderStatus,
  orderDetail,
  setOrderDetail,
  setShowOrderList,
  media = 'desktop',
}) {
  const isSelected = orderData === orderDetail;

  return (
    <div
      className={`orderList${isSelected ? ' isSelected' : ''}`}
      onClick={() => {
        setOrderDetail(orderData);
        setShowOrderList((e) => !e);
      }}
    >
      <div className="dateHCol">
        <div className="create_date">
          {new Date(orderData.created_at).toLocaleDateString('en-GB')}
        </div>
        <div className="order_id">{orderData._id}</div>
      </div>
      <div className="statusHCol">
        <div className="statusHHead">STATUS:</div>
        <div className="statusHValue">
          {orderStatus.find((stage) => stage._id === orderData.status_id)
            ?.stage_name || 'Stage Not Found'}
        </div>
      </div>
    </div>
  );
}

function OrderDetail({
  orderDetail,
  orderStatus,
  onClickShowOrderList,
  media = 'desktop',
}) {
  const order = orderDetail;
  const orderStatusList = orderStatus;

  function renderTimeLine(stage) {
    const stageNum =
      parseInt(orderStatusList?.findIndex((item) => item._id === stage)) + 1;
    const maxStage = orderStatusList.length - 3;
    let circleElements = [];
    for (let i = 1; i <= maxStage; i++) {
      let isStage = stageNum >= i ? 'currentStage' : '';
      let lineAfterClass = stageNum >= i + 1 ? 'currentStage' : '';
      circleElements.push(
        <div className={`circleRow row${i}`} key={`circleRow row${i}`}>
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
          <div className={`option notLetModify`} key={key}>
            {option[key][0]}
          </div>
        );
      }
      return options;
    }

    return items.map((item, index) => (
      <div className={`reviewProductRow` + ' ' + media} key={index}>
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
        {media === 'mobile' || media === 'tablet' ? (
          <></>
        ) : (
          <div className="priceCol">฿{item.property.product_price}</div>
        )}
        <div className="quantityCol">
          <div className="numAmount inReview">
            <div>{item.property.quantity}</div>
          </div>
        </div>
        <div className="totalCol">฿{item.property.totalPrice}</div>
      </div>
    ));
  }
  if (media === 'desktop' || media === 'tablet') {
    return (
      <div className="orderDetailBox">
        <div className="orderHeadLine">
          <h1>Order Detail</h1>
          <div className="orderIDCol">
            <h2 className="orderIDHead">ID</h2>
            <div className="orderIDValue">{order._id}</div>
          </div>
          <div className="orderDetail">
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
        <div className="secondOrderDetailLine">
          <div className="orderTimeLineContainer">
            <div className="orderTimeLineBox">
              <div className="circleColumn ">{renderTimeLine('stage4')}</div>
              <div className="detailTimeLineColumn">
                {orderStatusList.slice(0, -3).map((stage) => (
                  <div key={stage._id} className="stageName">
                    {stage.stage_name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="addressOrderSumContainer">
            <div className="addressContainer">
              <h2 className="thisOrderHead">CONTACT ADDRESS</h2>
              <div className="orderSumBox">
                <div className="namePhoneBox">
                  <div>{order.contact_info.real_name}</div>
                  <div>{order.contact_info.phone}</div>
                </div>
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
            </div>
            <div className="orderSumContainer">
              <h2 className="thisOrderHead">ORDER SUMMARY</h2>
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
        </div>
        <div className="thisOrderCartLine">
          <h2 className="thisOrderHead">ORDER CART</h2>
          <div className="thisOrderBox">
            <div className={`reviewProductHeadLine` + ' ' + media}>
              <div>PRODUCT</div>
              {media === 'tablet' ? <></> : <div>PRICE</div>}
              <div>QUANTITY</div>
              <div>TOTAL</div>
            </div>
            <div className="reviewProductList">
              <div className="reviewProductListContent inOrderDetail">
                {renderReviewProductList(order.items)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (media === 'mobile') {
    return (
      <div className="orderDetailBox">
        <div className="orderIDCol">
          <div className="hamburgerOrderBox">
            <img
              className="hamburgerOrderIcon"
              src={hamburgerMenuIcon}
              alt={'hamburgerMenuIcon'}
              onClick={onClickShowOrderList}
            />
          </div>
          <h2 className="orderIDHead">ID</h2>
          <div className="orderIDValue">{order._id}</div>
        </div>
        <div className="SameLine">
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

        <div className="secondOrderDetailLine">
          <div className="orderTimeLineContainer">
            <div className="orderTimeLineBox">
              <div className="circleColumn ">{renderTimeLine('stage4')}</div>
              <div className="detailTimeLineColumn">
                {orderStatusList.slice(0, -3).map((stage) => (
                  <div key={stage._id} className="stageName">
                    {stage.stage_name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="addressOrderSumContainer">
            <div className="addressContainer">
              <h2 className="thisOrderHead">CONTACT ADDRESS</h2>
              <div className="orderSumBox">
                <div className="namePhoneBox">
                  <div>{order.contact_info.real_name}</div>
                  <div>{order.contact_info.phone}</div>
                </div>
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
            </div>
            <div className="orderSumContainer">
              <h2 className="thisOrderHead">ORDER SUMMARY</h2>
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
        </div>
        <div className="thisOrderCartLine">
          <h2 className="thisOrderHead">ORDER CART</h2>
          <div className="thisOrderBox">
            <div className="reviewProductHeadLine">
              <div>PRODUCT</div>
              <div>QUANTITY</div>
              <div>TOTAL</div>
            </div>
            <div className="reviewProductList">
              <div className="reviewProductListContent inOrderDetail">
                {renderReviewProductList(order.items)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

export default function Order() {
  const [orderData, setOrderData] = useState({});
  const [orderDetail, setOrderDetail] = useState({});
  const { isDesktop, isTablet, isMobile } = useMediaContext();
  const [showOrderList, setShowOrderList] = useState(false);

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
  } else if (orderData.orderList === [] || orderDetail === undefined) {
    return (
      <div className="order">
        <CartOrderHeader nowPage="OrderPage" />
        <div className="orderPage">
          <div className="emptyOrder">EMPTY ORDER HISTORY</div>
        </div>
      </div>
    );
  } else if (isDesktop) {
    return (
      <div className="order">
        <CartOrderHeader nowPage="OrderPage" />
        <div className="cartOrderContainer">
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
                    media={'desktop'}
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
                media={'desktop'}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else if (isMobile) {
    return (
      <div className="order">
        <CartOrderHeader nowPage="OrderPage" />
        <div
          className={`orderListContainerMobile${showOrderList ? ' show' : ''}`}
        >
          <div className="orderListBoxMobile">
            <div className="orderListHeadLineMobile">
              <h1>Order History</h1>
              <div className="orderListOut">
                <img
                  src={xIcon}
                  alt={'xIcon'}
                  onClick={() => setShowOrderList((e) => !e)}
                />
              </div>
            </div>
            <div className="orderListConentMobile">
              {orderData === {} || orderData.orderList === undefined ? (
                <div>loading....</div>
              ) : (
                orderData.orderList.map((order) => (
                  <OrderList
                    orderData={order}
                    orderStatus={orderData.orderStatus}
                    orderDetail={orderDetail}
                    setOrderDetail={setOrderDetail}
                    setShowOrderList={setShowOrderList}
                    key={order._id}
                    media={'mobile'}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div
          className={`backDropOrderList${showOrderList ? ' show' : ''}`}
        ></div>
        <div className="cartOrderContainerMobile">
          <div className="orderDetailContainerMobile">
            {orderDetail === {} || orderData.orderStatus === undefined ? (
              <div>loading....</div>
            ) : (
              <OrderDetail
                orderDetail={orderDetail}
                orderStatus={orderData.orderStatus}
                onClickShowOrderList={() => setShowOrderList((e) => !e)}
                media={'mobile'}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else if (isTablet) {
    return (
      <div className="order">
        <CartOrderHeader nowPage="OrderPage" />
        <div className="cartOrderContainer">
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
                    media={'tablet'}
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
                media={'tablet'}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
