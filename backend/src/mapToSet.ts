const mapToSet = async (items: [any]) => {
  let set = new Set();
  items?.forEach((item: any) => {
    set.add(item.track || item);
  });
  return set;
};

export default mapToSet;
