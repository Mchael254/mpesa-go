# Dynamic Table Component

- This component is used to display data in a tabular format with various features such as pagination, sorting, filtering, and lazy loading. 
- It uses the p-table component from the PrimeNG library as the base template and adds some customizations and input properties.

## Table of Contents
- [Input Properties](#input-properties)
- [Output Properties](#output-properties)
- [Usage](#usage)
- [Code Samples](#code-samples)
  - [Sample 1: A simple table with pagination and global filtering](#sample-1-a-simple-table-with-pagination-and-global-filtering)
  - [Sample 2: A table with sorting and filtering by column](#sample-2-a-table-with-sorting-and-filtering-by-column)
  - [Sample 3: A table with lazy loading and routing](#sample-3-a-table-with-lazy-loading-and-routing) 


## Input Properties

The component accepts an object as an input property, **tableDetails**, which contains the following properties:
  - **cols**: an array of objects that define the columns of the table. Each object has a field property that specifies the name of the data field, and a header property that specifies the label of the column.
  - **rows**: an array of objects that contain the data for each row of the table. Each object has properties that match the fields of the columns.
  - **paginator**: a boolean value that indicates whether to show a paginator at the bottom of the table or not.
  - **globalFilterFields**: an array of strings that specify which fields to use for global filtering. Global filtering allows the user to search for a keyword across multiple fields using an input box at the top of the table.
  - **showSorting**: a boolean value that indicates whether to enable sorting by clicking on the column headers or not. Sorting allows the user to order the data by ascending or descending order based on a column field.
  - **showFilter**: a boolean value that indicates whether to enable filtering by clicking on a filter icon next to each column header or not. Filtering allows the user to apply a condition on a column field to filter out some rows from the table.
  - **rowsPerPage**: an optional number value that specifies how many rows to display per page. The default value is 5.
  - **title**: an optional string value that specifies the title of the table. It is displayed in the top left corner of the table.
  - **isLazyLoaded**: an optional boolean value that indicates whether to use lazy loading or not. Lazy loading allows the table to fetch data from a server only when needed, such as when changing pages, sorting, or filtering. This improves performance and reduces bandwidth usage for large datasets.
  - **url**: an optional string that specifies a URL for routing when clicking on a row. If this property is provided, an extra column with an action link will be added to the table. The action link will navigate to the URL with an identifier parameter from the row data.
  - **urlIdentifier**: an optional string that specifies which field from the row data to use as an identifier parameter for routing. This property is required if url is provided.
  - **totalElements**: an optional number value that specifies the total number of records that will be displayed in the table (in total i.e in all pages)

## Output Properties
  - **onLazyLoad(event)**

      <br/>This event emitter is used to emit an event of type **LazyLoadEvent or TableLazyLoadEvent** fetch data from a server from the parent component when using lazy loading. <br/><br/>
  
      It takes one parameter: event, which is an object that contains information about the current state of the table, such as page number, page size, sort field, sort order, filters, etc. <br/><br/>
  
      The parent method receiving the event emitted, should send an HTTP request to a server endpoint with these parameters and receive a response with an array of rows and a total number of records. The response should be assigned to the rows and totalElements properties respectively. <br/>

  ````angular2html
   <!--In  parent component!--> 
  <app-dynamic-table [tableDetails]="tableDetails" (onLazyLoad)="lazyLoadPolicies($event)"></app-dynamic-table>
  ````

  ````typescript
    <!--In parent component, this method handles the lazy loading receiving each lazy load event from the dynaic table !-->
  lazyLoadPolicies(event){
    
    }
  ````
## Usage
The component can be used in another component by importing it and adding it to the template with the following syntax:

```typescript
<app-dynamic-table [tableDetails]="tableDetails"></app-dynamic-table>
```

where tableDetails is an object that contains the input properties for the dynamic table component.

## Code Samples
Here are some code samples that show how to use the dynamic table component:

### Sample 1: A simple table with pagination and global filtering

````angular2html
<!-- In the parent component template -->
<app-dynamic-table [tableDetails]="tableDetails"></app-dynamic-table>
````

````typescript
// In the parent component class
tableDetails = {
  cols: [
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
    { field: 'gender', header: 'Gender' },
    { field: 'city', header: 'City' }
  ],
  rows: [
    { name: 'Alice', age: 25, gender: 'Female', city: 'Nairobi' },
    { name: 'Bob', age: 32, gender: 'Male', city: 'Mombasa' },
    { name: 'Charlie', age: 28, gender: 'Male', city: 'Kisumu' },
    { name: 'Diana', age: 23, gender: 'Female', city: 'Nakuru' },
    { name: 'Eve', age: 27, gender: 'Female', city: 'Eldoret' },
    { name: 'Frank', age: 30, gender: 'Male', city: 'Malindi' },
    { name: 'Grace', age: 26, gender: 'Female', city: 'Lamu' },
    { name: 'Harry', age: 29, gender: 'Male', city: 'Nyeri' },
    { name: 'Irene', age: 24, gender: 'Female', city: 'Meru' },
    { name: 'Jack', age: 31, gender: 'Male', city: 'Kitale' }
  ],
  paginator: true,
  rowsPerPage: 5,
  showCurrentPageReport: true,
  globalFilterFields:['name','age','gender','city'],
  title:'Simple Table'
};
````

### Sample 2: A table with sorting and filtering by column
````angular2html
<!-- In the parent component template -->
<dynamic-table [tableDetails]="tableDetails"></dynamic-table>
````

````typescript
// In the parent component class
tableDetails = {
  cols:[
    { field:'name', header:'Name'},
    { field:'age', header:'Age'},
    { field:'gender', header:'Gender'},
    { field:'city', header:'City'}
  ],
  rows:[
    { name:'Alice', age:'25', gender:'Female', city:'Nairobi'},
    { name:'Bob', age:'32', gender:'Male', city:'Mombasa'},
    { name:'Charlie', age:'28', gender:'Male', city:'Kisumu'},
    { name:'Diana', age:'23', gender:'Female', city:'Nakuru'},
    { name:'Eve', age:'27', gender:'Female', city:'Eldoret'},
    { name:'Frank', age:'30', gender:'Male', city:'Malindi'},
    { name:'Grace', age:'26', gender:'Female', city:'Lamu'},
    { name:'Harry', age:'29', gender:'Male', city:'Nyeri'},
    { name:'Irene', age:'24', gender:'Female', city:'Meru'},
    { name:'Jack', age:'31', gender:'Male', city:'Kitale'}
  ],
    paginator: true,
    rowsPerPage: 5,
    showCurrentPageReport:true,
    showSorting:true,
    showFilter:true,
    title:'Sortable and Filterable Table'
};
````

### Sample 3: A table with lazy loading and routing
````angular2html
<!-- In the parent component template -->
<dynamic-table [tableDetails]="tableDetails"></dynamic-table>
````

````typescript
// In the parent component class
import { HttpClient } from '@angular/common/http';
import { LazyLoadEvent } from "primeng/api";

tableDetails = {
  cols:[
      { field:"id", header:"ID"},
      { field:"title", header:"Title"},
      { field:"body", header:"Body"}
    ],
  rows:[],
  paginator:true,
  rowsPerPage: 10,
  showCurrentPageReport:true,
  isLazyLoaded:true,
  url:'/post-details',
  urlIdentifier:id, 
  title: 'Lazy Loaded and Routable Table' 
};

constructor(private http: HttpClient) {}

lazyLoad(event: LazyLoadEvent) { 
  const page = event.first / event.rows + 1;
  const pageSize = event.rows;
  const sortField = event.sortField; 
  const sortOrder = event.sortOrder == 1 ? 'asc' : 'desc';
  const filters = ...event.filters;
  // Send an HTTP request to a server endpoint with the event parameters
  // this.http.get(‘https://jsonplaceholder.typicode.com/posts’, { params: { _page: page, size: pageSize, sort: sortField, order: sortOrder , filters } }).subscribe((res: any) => { // Assign the response to the rows and totalElements properties this.tableDetails.rows = res; this.tableDetails.totalElements = res.length; }); 
 }
````
