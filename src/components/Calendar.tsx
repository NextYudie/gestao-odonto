import { useMemo } from 'react';

const Calendar = ({ currentMonth, setCurrentMonth, appointments, onDayClick }) => {
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInCurrentMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  const appointmentsByDay = useMemo(() => {
    const map = new Map();
    if (appointments) {
      appointments.forEach(app => {
        const day = new Date(app.appointment_date).getDate();
        if (!map.has(day)) {
          map.set(day, []);
        }
        map.get(day).push(app);
      });
    }
    return map;
  }, [appointments, currentMonth]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Calendário</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="px-4 py-1 font-medium">{capitalizedMonth}</span>
          <button
            onClick={() => navigateMonth(1)}
            className="px-3 py-1 border rounded hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4 text-center">
        {weekDays.map((day) => (
          <div key={day} className="font-bold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((date, index) => {
          const dayNumber = date ? date.getDate() : null;
          const hasAppointments = dayNumber ? appointmentsByDay.has(dayNumber) : false;

          return (
            <div
              key={index}
              onClick={() => date && onDayClick(date)}
              className={`calendar-day p-2 text-center border rounded cursor-pointer ${
                date
                  ? 'hover:bg-blue-100'
                  : 'text-gray-300'
              }`}
            >
              {dayNumber && (
                <>
                  {dayNumber}
                  {hasAppointments && (
                    <span className="w-2 h-2 bg-amber-500 rounded-full inline-block ml-1"></span>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Calendar;