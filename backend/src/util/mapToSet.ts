const mapToSet = async (items: any[]) => {
  let set = new Set<any>();
  if (!items) {
    return new Set<any>();
  }
  items?.forEach((item: any) => {
    set.add(item.track || item);
  });
  return set;
};

export default mapToSet;
