import { Image } from '@mantine/core';
import dashboard from "../assets/icons/dashboard.svg";
import dashboard2 from "../assets/icons/dashboard2.svg";
import post_cargo from "../assets/icons/post-cargo.svg";
import post_cargo2 from "../assets/icons/post-cargo2.svg"; 2
import tracking from "../assets/icons/tracking.svg";
import tracking2 from "../assets/icons/tracking2.svg";
import document from "../assets/icons/document.svg";
import document2 from "../assets/icons/document2.svg";
import bids from "../assets/icons/bids.svg";
import bids2 from "../assets/icons/bids2.svg";
import report from "../assets/icons/report.svg";
import report2 from "../assets/icons/report2.svg";
import setting from "../assets/icons/setting.svg";
import setting2 from "../assets/icons/setting2.svg";
import logout from "../assets/icons/logout.svg";
import eve from "../assets/icons/eve.svg";
import close from "../assets/icons/close.svg";
import arrow_up from "../assets/icons/arrow-up.svg";
import arrow_down from "../assets/icons/arrow_down.svg";
import search from "../assets/icons/search.svg";
import notification from "../assets/icons/notification.svg";
import chevron_down from "../assets/icons/chevron_down.svg";
import box from "../assets/icons/box.svg";
import box2 from "../assets/icons/box2.svg";
import info_circle from "../assets/icons/info_circle.svg";
import circle_arrow_right from "../assets/icons/circle_arrow_right.svg";
import circle_arrow_left from "../assets/icons/circle_arrow_left.svg";
import truck_fast from "../assets/icons/truck_fast.svg";
import filter from "../assets/icons/filter.svg";
import exportIcon from "../assets/icons/export.svg";
import point from "../assets/icons/point.svg";
import location from "../assets/icons/location.svg";
import location2 from "../assets/icons/location2.svg";
import arrow_right from "../assets/icons/arrow_right.svg";
import doc from "../assets/icons/doc.svg";
import empty from "../assets/icons/empty.svg";
import paper_upload from "../assets/icons/paper_upload.svg";
import notification_blue from "../assets/icons/notification_blue.svg";
import billing from "../assets/icons/billing.svg";
import billing2 from "../assets/icons/billing2.svg";
import billing_stats from "../assets/icons/billing_stats.svg";
import credit_pay from "../assets/icons/credit_pay.png";
import mobile_pay from "../assets/icons/mobile_pay.svg";
import bank_transfer from "../assets/icons/bank_transfer.svg";
import message from "../assets/icons/message.svg";
import archive from "../assets/icons/archive.svg";
import google from "../assets/icons/google.svg";


interface CustomIconProps {
  src: string;
  alt?: string;
};

const createCustomIcon = ({ src, alt }: CustomIconProps) => {
  return <Image src={src}  alt={alt} />
};
const rotatingIcon = ({ src }: CustomIconProps) => {
  return <>
    <Image src={src} style={{
      animation: 'spin 2s linear infinite',
      width: '24px', // Adjust as needed
      height: '24px', // Adjust as needed
    }} />
    <style>
      {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
    </style>
  </>
};


export const Icons = {
  dashboard: createCustomIcon({ src: dashboard }),
  dashboard2: createCustomIcon({ src: dashboard2 }),
  post_cargo: createCustomIcon({ src: post_cargo }),
  post_cargo2: createCustomIcon({ src: post_cargo2 }),
  tracking: createCustomIcon({ src: tracking }),
  tracking2: createCustomIcon({ src: tracking2 }),
  document: createCustomIcon({ src: document }),
  document2: createCustomIcon({ src: document2 }),
  bids: createCustomIcon({ src: bids }),
  bids2: createCustomIcon({ src: bids2 }),
  report: createCustomIcon({ src: report }),
  report2: createCustomIcon({ src: report2 }),
  setting: createCustomIcon({ src: setting }),
  setting2: createCustomIcon({ src: setting2 }),
  logout: createCustomIcon({ src: logout }),
  eve: rotatingIcon({ src: eve }),
  eve2: rotatingIcon({ src: eve }),
  close: createCustomIcon({ src: close }),
  arrow_up: createCustomIcon({ src: arrow_up }),
  arrow_down: createCustomIcon({ src: arrow_down }),
  search: createCustomIcon({ src: search }),
  notification: createCustomIcon({ src: notification}),
  notification_blue: createCustomIcon({ src: notification_blue }),
  chevron_down: createCustomIcon({ src: chevron_down }),
  box: createCustomIcon({ src: box }),
  info_circle: createCustomIcon({ src: info_circle }),
  circle_arrow_right: createCustomIcon({ src: circle_arrow_right }),
  circle_arrow_left: createCustomIcon({ src: circle_arrow_left }),
  truck_fast: createCustomIcon({ src: truck_fast }),
  filter: createCustomIcon({ src: filter }),
  point: createCustomIcon({ src: point }),
  location: createCustomIcon({ src: location }),
  location2: createCustomIcon({ src: location2 }),
  arrow_right: createCustomIcon({ src: arrow_right }),
  box2: createCustomIcon({ src: box2 }),
  doc: createCustomIcon({ src: doc }),
  empty: createCustomIcon({ src: empty }),
  exportIcon: createCustomIcon({ src: exportIcon }),
  paper_upload: createCustomIcon({ src: paper_upload }),
  billing: createCustomIcon({ src: billing }),
  billing2: createCustomIcon({ src: billing2 }),
  billingStats: createCustomIcon({ src: billing_stats }),
  creditPay: createCustomIcon({ src: credit_pay }),
  mobilePay: createCustomIcon({ src: mobile_pay }),
  bankTransfer: createCustomIcon({ src: bank_transfer }),
  message: createCustomIcon({ src: message }),
  archive: createCustomIcon({ src: archive }),
  google: createCustomIcon({ src: google }),
};
