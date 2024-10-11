import iconBills from "../assets/images/icon-bills.svg";
import iconDiningOut from "../assets/images/icon-dining-out.svg";
import iconEducation from "../assets/images/icon-education.svg";
import iconEntertainment from "../assets/images/icon-entertainment.svg";
import iconGeneral from "../assets/images/icon-general.svg";
import iconGroceries from "../assets/images/icon-groceries.svg";
import iconLifestyle from "../assets/images/icon-lifestyle.svg";
import iconPersonalCare from "../assets/images/icon-personal-care.svg";
import iconShopping from "../assets/images/icon-shopping.svg";
import iconTransportation from "../assets/images/icon-transportation.svg";

export const getIconByCategory = (category: string) => {
  switch (category) {
    case "Entertainment":
      return iconEntertainment;
    case "Bills":
      return iconBills;
    case "Groceries":
      return iconGroceries;
    case "Dining Out":
      return iconDiningOut;
    case "Transportation":
      return iconTransportation;
    case "Personal Care":
      return iconPersonalCare;
    case "Education":
      return iconEducation;
    case "Lifestyle":
      return iconLifestyle;
    case "Shopping":
      return iconShopping;
    case "General":
      return iconGeneral;
    default:
      return "";
  }
};

export const getThemeByCategory = (category: string) => {
  switch (category) {
    case "Entertainment":
      return "#277C78";
    case "Bills":
      return "#82C9D7";
    case "Groceries":
      return "#C94736";
    case "Dining Out":
      return "#CAB361";
    case "Transportation":
      return "#3F82B2";
    case "Personal Care":
      return "#626070";
    case "Education":
      return "#93674F";
    case "Lifestyle":
      return "#826CB0";
    case "Shopping":
      return "#BE6C49";
    case "General":
      return "#97A0AC";
    default:
      return "";
  }
};
