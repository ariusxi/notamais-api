'use strict';

exports.concat = async(arr1, arr2) => {
    let newArr = [];
    for(let it in arr1){
        newArr.push(arr1[it]);
    }
    for(let it in arr2){
        newArr.push(arr2[it]);
    }
    return newArr;
}