const mapToSet = async (items: any[]) => {
  let set = new Set();
  if (!items) {
    return new Set();
  }
  items?.forEach((item: any) => {
    set.add(item.track || item);
  });
  return set;
};

export default mapToSet;
