class ContextMemoryStore {
  ContextMemoryStore({this.maxEntries = 14});

  final int maxEntries;
  final List<Map<String, Object>> _entries = [];

  List<Map<String, Object>> snapshot() => List.unmodifiable(_entries);

  void add(Map<String, Object> entry) {
    _entries.add(entry);
    if (_entries.length > maxEntries) {
      _entries.removeRange(0, _entries.length - maxEntries);
    }
  }
}
