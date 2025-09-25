const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-amber-100 text-amber-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="stat-card card rounded-lg p-6 shadow bg-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;