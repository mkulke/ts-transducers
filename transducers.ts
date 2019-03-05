type PredicateFn<V> = (v: V) => boolean;

type FilterRdcr<V> = (a: V[], v: V) => V[];
function buildFilterRdcr<T>(predicateFn: PredicateFn<T>): FilterRdcr<T> {
  return (acc, val) => (predicateFn(val) ? [...acc, val] : acc);
}

type FilterTdcr<V> = (r: FilterRdcr<V>) => FilterRdcr<V>;
function buildFilterTdcr<V>(predicateFn: PredicateFn<V>): FilterTdcr<V> {
  return rdcr => (acc, val) => (predicateFn(val) ? rdcr(acc, val) : acc);
}

type MapRdcr<I, O> = (a: O[], v: I) => O[];
function buildMapRdcr<I, O>(transformFn: (v: I) => O): (a: O[], v: I) => O[] {
  return (acc, val) => [...acc, transformFn(val)];
}

type MapTdcr<I, O, X> = (m: MapRdcr<O, X>) => MapRdcr<I, X>;
function buildMapTdcr<I, O, X>(transformFn: (i: I) => O): MapTdcr<I, O, X> {
  return rdcr => (acc, val) => rdcr(acc, transformFn(val));
}

const numbers = [1, 2, 3, 4];
const reduced = numbers
  .reduce(buildFilterRdcr(v => v > 2), [])
  .reduce(buildMapRdcr(v => v.toString()), []);

console.log('reduced %j', reduced);

const identityRdcr = buildMapRdcr(x => x);
const filterTdcr = buildFilterTdcr(v => v > 1);
const mapTdcr = buildMapTdcr(v => v.toString());

const transduced = numbers.reduce(filterTdcr(mapTdcr(identityRdcr)), []);

console.log('transduced %j', transduced);
