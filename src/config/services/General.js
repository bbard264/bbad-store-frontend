import { useNavigate } from 'react-router-dom';

export function formatDatetoSTR(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed.
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

export function NaviToProudctDetail(product_id, product_url_name) {
  const navigate = useNavigate();
  if (product_url_name) {
    const sendto = `/product-detail/${
      'id=' + product_id + '/' + product_url_name
    }`;
    navigate(sendto);
  } else {
    const sendto = `/product-detail/${'id=' + product_id}`;
    navigate(sendto);
  }
}
