class ChartPoint {
  const ChartPoint({
    required this.label,
    required this.value,
  });

  final String label;
  final double value;

  Map<String, Object> toJson() => {'label': label, 'value': value};
}
