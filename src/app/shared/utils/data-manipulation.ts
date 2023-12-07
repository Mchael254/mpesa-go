export class DataManipulation {
    
    /**
 * Removes a key/value pair from each object in a list at a specified position.
 * @param {Array} objectsList - The list of objects to modify.
 * @param {number} keyPosition - The position of the key to remove.
 * @returns {Array} - The modified list of objects.
 */
 public static removePopertyFromListByPosition(objectsList: any[], keyPosition: number) {
    if (keyPosition < 0) {
      console.error('Invalid key position');
      return objectsList;
    }
  
    /**
     * Map through the list and remove the key at the specified position from each object.
     * @param {Object} obj - The current object in the list.
     * @returns {Object} - The modified object.
     */
    const updatedList = objectsList.map(obj => {
      const entries = Object.entries(obj);
  
      if (keyPosition >= entries.length) {
        console.error('Invalid key position for an object');
        return obj;
      }
  
      const updatedEntries = entries.filter((_, index) => index !== keyPosition);
  
      return Object.fromEntries(updatedEntries);
    });
  
    return updatedList;
  }

  /**
 * Get the key names from the first object in the list and create a list of objects
 * with name and isVisible properties.
 * @param {Array} objectsList - The list of objects.
 * @returns {Array} - The list of objects with name and isVisible properties.
 */
  public static createVisibilityList(objectsList: any[]) {
    if (objectsList.length === 0) {
      console.error('List is empty');
      return [];
    }
  
    const keys = Object.keys(objectsList[0]);
  
    return keys.map(key => ({
      name: key,
      isVisible: true, // You can set the default visibility here
    }));
  }

  /**
 * Get the keys from the first object in the list.
 * @param {Array} objectsList - The list of objects.
 * @returns {Array} - The list of keys.
 */
public static getKeysFromObjectsList(objectsList: any[]) {
    if (objectsList.length === 0) {
      console.error('List is empty');
      return [];
    }
  
    return Object.keys(objectsList[0]);
  }

    /**
 * Get the keys from the first object in the list.
 * @param {Array} objectsList - The list of objects.
 * @returns {Array} - The list of keys.
 */
public static getKeysFromObjects(object: any) {
  if (object === null) {
    return [];
  }

  return Object.keys(object);
}
  
//   // Example usage:
//   const listOfObjects = [
//     { key1: 'value1', key2: 'value2', key3: 'value3' },
//     { key1: 'value4', key2: 'value5', key3: 'value6' },
//     { key1: 'value7', key2: 'value8', key3: 'value9' },
//   ];
//   const keyPositionToRemove = 1; // Remove the key at position 1
  
//   const updatedListOfObjects = removeKeyValueFromObjectsByPosition(listOfObjects, keyPositionToRemove);
//   console.log(updatedListOfObjects);
  
}