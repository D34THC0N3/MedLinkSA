window.medlinkUtils = window.medlinkUtils || {
  formatDate(value) {
    return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(value));
  }
};
