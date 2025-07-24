import { Image } from '@mantine/core';
import arrow_up from "../assets/icons/arrow-up.svg";
import arrow_down from "../assets/icons/arrow_down.svg";
import chevron_down from "../assets/icons/chevron_down.svg";
import circle_arrow_left from "../assets/icons/circle_arrow_left.svg";
import circle_arrow_right from "../assets/icons/circle_arrow_right.svg";
import close from "../assets/icons/close.svg";
import facebook from "../assets/icons/facebook.png";
import google from "../assets/icons/google.svg";
import location from "../assets/icons/location.svg";
import location2 from "../assets/icons/location2.svg";
import logout from "../assets/icons/logout.svg";
import message from "../assets/icons/message.svg";
import notification from "../assets/icons/notification.svg";
import notification_blue from "../assets/icons/notification_blue.svg";
import archive from "../assets/icons/archive.svg";
import arrow_right from "../assets/icons/arrow_right.svg";
import search from "../assets/icons/search.svg";



interface CustomIconProps {
  src: string;
  alt?: string;
};

const createCustomIcon = ({ src, alt }: CustomIconProps) => {
  return <Image src={src}  alt={alt} />
};



export const Icons = {
  arrow_up: createCustomIcon({ src: arrow_up }),
  arrow_down: createCustomIcon({ src: arrow_down }),
  chevron_down: createCustomIcon({ src: chevron_down }),
  circle_arrow_left: createCustomIcon({ src: circle_arrow_left }),
  circle_arrow_right: createCustomIcon({ src: circle_arrow_right }),
  close: createCustomIcon({ src: close }),
  facebook: createCustomIcon({ src: facebook }),
  google: createCustomIcon({ src: google }),
  location: createCustomIcon({ src: location }),
  location2: createCustomIcon({ src: location2 }),
  logout: createCustomIcon({ src: logout }),
  message: createCustomIcon({ src: message }),
  notification: createCustomIcon({ src: notification }),
  notification_blue: createCustomIcon({ src: notification_blue }),
  archive: createCustomIcon({ src: archive }),
  arrow_right: createCustomIcon({ src: arrow_right }),
  search: createCustomIcon({ src: search }),
};
