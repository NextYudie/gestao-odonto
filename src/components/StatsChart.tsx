const StatsChart = () => {
  const metrics = [
    {
      label: 'Taxa de Ocupação',
      percentage: 75,
      color: 'bg-blue-600'
    },
    {
      label: 'Satisfação do Paciente',
      percentage: 92,
      color: 'bg-green-600'
    },
    {
      label: 'Tempo Médio de Espera',
      percentage: 35,
      color: 'bg-yellow-600',
      displayValue: '15 min'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold mb-4">Estatísticas Rápidas</h2>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <p className="text-gray-600 mb-1">{metric.label}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${metric.color}`}
                style={{ width: `${metric.percentage}%` }}
              ></div>
            </div>
            <p className="text-right text-sm mt-1">
              {metric.displayValue || `${metric.percentage}%`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsChart;