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

const today = new Date();
const todayDay = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();
const currentDayOfWeek = today.getDay();

const fiveDaysFromNow = new Date(today);
fiveDaysFromNow.setDate(today.getDate() + 5);
const upcomingDay = fiveDaysFromNow.getDate();

export const isDueSoon = (bill: RecurringBill) => {
  if (bill.frequency === "monthly") {
    return bill.dueDate > todayDay && bill.dueDate <= upcomingDay;
  } else if (bill.frequency === "weekly") {
    return (
      bill.dueDate > currentDayOfWeek &&
      bill.dueDate <= (currentDayOfWeek + 5) % 7
    );
  } else if (bill.frequency === "biweekly") {
    return (
      bill.dueDate > currentDayOfWeek &&
      bill.dueDate <= (currentDayOfWeek + 5) % 14
    );
  }
  return false;
};

export const isOverdue = (bill: RecurringBill) => {
  let dueDate;

  if (bill.frequency === "monthly") {
    dueDate = new Date(todayYear, todayMonth, bill.dueDate);
  } else if (bill.frequency === "weekly") {
    const daysToNextDue = (7 + bill.dueDate - todayDay) % 7;
    dueDate = new Date(todayYear, todayMonth, todayDay + daysToNextDue);
  } else if (bill.frequency === "biweekly") {
    const daysToNextDue = (14 + bill.dueDate - todayDay) % 14;
    dueDate = new Date(todayYear, todayMonth, todayDay + daysToNextDue);
  } else {
    return false;
  }

  return dueDate < today;
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
