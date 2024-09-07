class Util {
    /**
     * Returns whether or not every element in the array is a string
     * 
     * @param {Array} array 
     * @returns {Boolean}
     */
    static isArrayOfStrings(array) {
        return array.every(item => typeof item === "string");
    }

    /**
     * Factory that creates an object that represents an enumerable property (parameter)
     * for Vue components. This means that the argument must be out of the provided array
     * 
     * @param {Object} enumerable note that the type of each of the values must be consistent
     * @returns  {Object}
     */
    static createEnumProperty(enumerable) {
        const values = Object.values(enumerable);
        return {
            type: values[0].constructor,
            required: true,
            validator: (value) => values.includes(value)
        }
    }
}

export default Util;