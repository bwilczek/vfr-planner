export function add(item) {
  return {
    type: 'ITEM_LIST_ADD',
    payload: item,
  }
}
