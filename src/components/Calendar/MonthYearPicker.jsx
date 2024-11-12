import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const MonthRangePicker = ({ onSelect, triggerText = "Select Date Range" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectingStart, setSelectingStart] = useState(true);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleYearChange = (increment) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(prevDate.getFullYear() + increment);
      return newDate;
    });
  };

  const calculateDaysBetween = (start, end) => {
    if (!start || !end) return 0;
    const date1 = new Date(start.year, start.month - 1);
    const date2 = new Date(end.year, end.month - 1);

    // Get the last day of each month
    date2.setMonth(date2.getMonth() + 1, 0);

    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateMonthsBetween = (start, end) => {
    if (!start || !end) return 0;
    return (end.year - start.year) * 12 + (end.month - start.month);
  };

  const handleMonthSelect = (monthIndex) => {
    const selectedDate = {
      month: monthIndex + 1,
      year: currentDate.getFullYear(),
      formatted: `${months[monthIndex]} ${currentDate.getFullYear()}`,
    };

    if (selectingStart) {
      // Check if the selected month is not in the past
      const isNotInPast =
        selectedDate.year > new Date().getFullYear() ||
        (selectedDate.year === new Date().getFullYear() &&
          selectedDate.month >= new Date().getMonth() + 1);

      if (isNotInPast) {
        setStartDate(selectedDate);
        setSelectingStart(false);
      } else {
        handleErrorMessage();
      }
    } else {
      // Ensure end date is not earlier than start date
      if (
        startDate &&
        (selectedDate.year < startDate.year ||
          (selectedDate.year === startDate.year && selectedDate.month < startDate.month))
      ) {
        handleEndDateBeforeStartError();
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const isValidDateRange = () => {
    if (!startDate || !endDate) return false;
    const monthsDiff = calculateMonthsBetween(startDate, endDate);
    return monthsDiff >= 2; // 3 months inclusive (e.g., Jan to Mar is 2 months difference)
  };

  const handleConfirm = () => {
    const monthsDiff = calculateMonthsBetween(startDate, endDate);
    onSelect({
      startDate,
      endDate,
      monthsDiff,
    });
    setIsOpen(false);
    setSelectingStart(true);
  };

  const handleErrorMessage = () => {
    MySwal.fire({
      title: "Error",
      text: "You cannot select a month in the past as the start date.",
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        container: 'p-6 rounded-lg shadow-lg',
        title: 'text-lg font-medium',
        content: 'text-gray-700',
        confirmButton: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition'
      }
    });
  };

  const handleEndDateBeforeStartError = () => {
    MySwal.fire({
      title: "Error",
      text: "End date cannot be earlier than start date, please click the reset button below if you need to change start date.",
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        container: 'p-6 rounded-lg shadow-lg',
        title: 'text-lg font-medium',
        content: 'text-gray-700',
        confirmButton: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition'
      }
    });
  };

  const isDateInRange = (monthIndex) => {
    if (!startDate) return true; // Allow all months before start date

    const currentYearMonth = {
      year: currentDate.getFullYear(),
      month: monthIndex + 1,
    };

    const startYearMonth = {
      year: startDate.year,
      month: startDate.month,
    };

    const isAfterOrCurrentMonth =
      currentYearMonth.year > startYearMonth.year ||
      (currentYearMonth.year === startYearMonth.year &&
        currentYearMonth.month >= startYearMonth.month);

    const isNotInPast =
      currentYearMonth.year > new Date().getFullYear() ||
      (currentYearMonth.year === new Date().getFullYear() &&
        currentYearMonth.month >= new Date().getMonth() + 1);

    return isAfterOrCurrentMonth && isNotInPast;
  };

  const getDaysBetweenText = () => {
    if (startDate && endDate) {
      const monthsDiff = calculateMonthsBetween(startDate, endDate);
      const days = calculateDaysBetween(startDate, endDate);
      const isValid = monthsDiff >= 2;
      return (
        <div
          className={`mt-4 text-center ${
            isValid ? "text-gray-600" : "text-red-600"
          }`}
        >
          {`${monthsDiff + 1} months (${days} days)`}
          {!isValid && (
            <div className="text-sm mt-1">
              Minimum rental duration is 3 months
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition"
      >
        {startDate && endDate
          ? `${startDate.formatted} - ${endDate.formatted}`
          : triggerText}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-center w-full">
            {selectingStart ? "Select Start Month" : "Select End Month"}
          </h2>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectingStart(true);
              setStartDate(null);
              setEndDate(null);
            }}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>

        <div className="p-4">
          {startDate && !selectingStart && (
            <div className="mb-4 text-center text-green-600">
              <div className="flex justify-center items-center">
                <span>Start: {startDate.formatted}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xl font-semibold">
              {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => handleYearChange(1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {months.map((month, index) => {
              const isStart =
                startDate &&
                startDate.month === index + 1 &&
                startDate.year === currentDate.getFullYear();

              const isEnd =
                endDate &&
                endDate.month === index + 1 &&
                endDate.year === currentDate.getFullYear();

              const isInRange = isDateInRange(index);

              return (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  className={`h-12 border rounded-lg transition-colors
                    ${
                      isStart || isEnd
                        ? "bg-green-600 text-white border-green-600"
                        : isInRange
                        ? "bg-green-100 border-green-200"
                        : "hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                    }`}
                >
                  {month.slice(0, 3)}
                </button>
              );
            })}
          </div>

          {getDaysBetweenText()}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setSelectingStart(true);
              }}
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              Reset
            </button>
            <button
              onClick={() => {
                if (!isValidDateRange()) {
                  handleErrorMessage();
                  return;
                }
                handleConfirm();
              }}
              disabled={!startDate || !endDate || !isValidDateRange()}
              className={`px-4 py-2 rounded-lg transition
                ${
                  startDate && endDate && isValidDateRange()
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthRangePicker;