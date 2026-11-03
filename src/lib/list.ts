export function moveListItem<Item>(list: Item[], fromIndex: number, direction: -1 | 1) {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= list.length) return list;

    const nextList = [...list];
    [nextList[fromIndex], nextList[toIndex]] = [nextList[toIndex], nextList[fromIndex]];
    return nextList;
}