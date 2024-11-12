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
import { RecurringBill } from "../types";

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

export const getColorByName = (name: string) => {
  switch (name) {
    case "Green":
      return "#277C78";
    case "Yellow":
      return "#F2CDAC";
    case "Cyan":
      return "#82C9D7";
    case "Navy":
      return "#626070";
    case "Red":
      return "#C94736";
    case "Purple":
      return "#826CB0";
    case "Turquoise":
      return "#597C7C";
    case "Brown":
      return "#93674F";
    case "Magenta":
      return "#934F6F";
    case "Blue":
      return "3F82B2";
    case "Grey":
      return "#97A0AC";
    case "Army":
      return "#7F9161";
    case "Pink":
      return "#AF81BA";
    case "Gold":
      return "#CAB361";
    case "Orange":
      return "#BE6C49";
    default:
      return "";
  }
};

export const getNameByColor = (color: string) => {
  switch (color) {
    case "#277C78":
      return "Green";
    case "#F2CDAC":
      return "Yellow";
    case "#82C9D7":
      return "Cyan";
    case "#626070":
      return "Navy";
    case "#C94736":
      return "Red";
    case "#826CB0":
      return "Purple";
    case "#597C7C":
      return "Turquoise";
    case "#93674F":
      return "Brown";
    case "#934F6F":
      return "Magenta";
    case "3F82B2":
      return "Blue";
    case "#97A0AC":
      return "Grey";
    case "#7F9161":
      return "Army";
    case "#AF81BA":
      return "Pink";
    case "#CAB361":
      return "Gold";
    case "#BE6C49":
      return "Orange";
    default:
      return "";
  }
};

const today = new Date();
const todayDay = today.getDate();

const fiveDaysFromNow = new Date(today);
fiveDaysFromNow.setDate(today.getDate() + 5);
const upcomingDay = fiveDaysFromNow.getDate();

export const isDueSoon = (bill: RecurringBill) => {
  const billDueDate = new Date(bill.dueDate);

  return (
    billDueDate.getDate() >= todayDay && billDueDate.getDate() <= upcomingDay
  );
};

export const isOverdue = (bill: RecurringBill) => {
  const billDueDate = new Date(bill.dueDate);

  return billDueDate.getDate() < todayDay;
};

export const getDayWithSuffix = (dueDate: number) => {
  if (dueDate > 3 && dueDate < 21) return `${dueDate}th`;
  switch (dueDate % 10) {
    case 1:
      return `${dueDate}st`;
    case 2:
      return `${dueDate}nd`;
    case 3:
      return `${dueDate}rd`;
    default:
      return `${dueDate}th`;
  }
};
