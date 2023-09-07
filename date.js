exports.getDate = function () {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };
  return today.toLocaleDateString("en-US", options);
};
