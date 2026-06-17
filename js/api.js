window.medlinkApi = window.medlinkApi || {
  get(table) {
    return window.db ? window.db.getTable(table) : [];
  }
};
