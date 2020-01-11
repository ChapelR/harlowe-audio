(function () {
    'use strict';

    function fastForEach (arr, fn) {
        var lt = arr.length, i;
        
        for (i = 0; i < lt; i++) {
            fn(arr[i], i, arr);
        }
    }
    
    function fastFilter (arr, fn) {
        var lt = arr.length,
            ret = [], i;
        
        for (i = 0; i < lt; i++) {
            if (fn(arr[i], i, arr)) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    
    function fastMap (arr, fn) {
        var lt = arr.length,
            ret = new Array(lt), i;
        
        for (i = 0; i < lt; i++) {
            ret[i] = fn(arr[i], i, arr);
        }
        
        return ret;
    }
    
    function fastFind (arr, fn) {
        var lt = arr.length, i;
        
        for (i = 0; i < lt; i++) {
            if (fn(arr[i], i, arr)) {
                return arr[i];
            }
        }
        return undefined;
    }
    
    function fastFindIndex (arr, fn) {
        var lt = arr.length, i;
        
        for (i = 0; i < lt; i++) {
            if (fn(arr[i], i, arr)) {
                return i;
            }
        }
        return -1;
    }
    
    function fastSome (arr, fn) {
        var lt = arr.length, i;
        
        for (i = 0; i < lt; i++) {
            if (fn(arr[i], i, arr)) {
                return true;
            }
        }
        
        return false;
    }
    
    window.Fast = {
        filter : fastFilter,
        forEach : fastForEach,
        map : fastMap,
        find : fastFind,
        findIndex: fastFindIndex,
        some : fastSome
    };

}());