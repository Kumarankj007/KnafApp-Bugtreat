import {Dimensions} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const {width} = Dimensions.get('screen');

export const fontScalling = size => {
  if (size > 0) {
    return width > 500
      ? responsiveFontSize(size - 0.5)
      : responsiveFontSize(size);
  }
};

export const print = (data, str) => {
  console.log(JSON.stringify(data, undefined, 2), str);
};

// Dutch month num='05' -> mei
export const dutchMonth = num => {
  switch (num) {
    case '01':
      return 'januari';
    case '02':
      return 'februari';
    case '03':
      return 'maart';
    case '04':
      return 'april';
    case '05':
      return 'mei';
    case '06':
      return 'juni';
    case '07':
      return 'juli';
    case '08':
      return 'augustus';
    case '09':
      return 'september';
    case '10':
      return 'oktober';
    case '11':
      return 'november';
    case '12':
      return 'december';
  }
};

//format -> 04/03/24
export function formatedDate(dateString) {
  const date = new Date(dateString);
  const dates = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const year = String(date.getFullYear()).slice(2);
  return `${dates}/${month}/${year}`;
}
