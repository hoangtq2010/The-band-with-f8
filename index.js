const arr1 = [1, 2, 6, 8];
const arr2 = [2, 9, 6];

function findEqualValues(arr1, arr2) {
    
    return arr1.filter(a => arr2.includes(a))
}
console.log(findEqualValues(arr1,arr2));
