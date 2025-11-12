// import React, { useState } from "react";

// const MenuBar = () => {

//   const getProductCountSpan = (productCount) => {
//   return (
//     <span className="product-count text-gray-700">
//       {productCount} PRODUCTS
//     </span>
//   );
// };
//   const [size, setSize] = useState("All");
//   const [availability, setAvailability] = useState("All");
//   const [sort, setSort] = useState("Featured");
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [tempSize, setTempSize] = useState(size);
//   const [tempAvailability, setTempAvailability] = useState(availability);
//   const [tempSort, setTempSort] = useState(sort);

//   const productCount = getProductCountSpan;

//     const applyFilters = () => {
//     setSize(tempSize);
//     setAvailability(tempAvailability);
//     setSort(tempSort);
//     setIsFilterModalOpen(false);
//   };

//   const removeAllFilters = () => {
//     setTempSize("All");
//     setTempAvailability("All");
//     setTempSort("Featured");
//   };

//   const closeModal = () => {
//     setTempSize(size);
//     setTempAvailability(availability);
//     setTempSort(sort);
//     setIsFilterModalOpen(false);
//   };

//   return (
//     <div className="text-xs bg-[#EFEFEF]">
//           <div className="relative font-medium text-xs p-5 mt-21 px-10 text-gray-900 bg-[#EFEFEF]">ALL PRODUCTS</div>
//       <div className="filter-bar hidden sm:flex bg-[#EFEFEF]">
//         <div className="filter-options">
//           <div className="filter-group flex justify-between ml-10">
//             <label className="text-gray-700 text-xs" >
//               FILTER:
//               <select className="text-gray-700 hover:cursor-pointer" value={size} onChange={e => setSize(e.target.value)}>
//                 <option className=" hover:cursor-pointer" value="All">Size</option>
//                 <option className=" hover:cursor-pointer" value="S">100 ml</option>
//               </select>
//             </label>
//             <label>
//               <select className="text-gray-700  hover:cursor-pointer" value={availability} onChange={e => setAvailability(e.target.value)}>
//                 <option value="InStock">In Stock</option>
//                 <option value="OutOfStock">Out of Stock</option>
//               </select>
//             </label>
//           </div>
//         </div>
//         <div className="sort-group text-xs">
//           <label className="text-gray-700">
//             SORT BY:
//             <select className="ml-3 text-gray-700  hover:cursor-pointer" value={sort} onChange={e => setSort(e.target.value)}>
//               <option>Featured</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//               <option>Newest</option>
//             </select>
//           </label>
//           {getProductCountSpan(productCount)}
//         </div>
//       </div>
//       {/* Mobile/Small Screen Filter Button - Fixed at bottom with full width */}
//        <div className="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-black text-white z-30">
//          <button 
//           className="w-full py-4 text-center text-sm font-medium tracking-wider"
//           onClick={() => setIsFilterModalOpen(true)}
//         >
//           FILTER AND SORT
//         </button>
//       </div>

//       {/* Mobile Filter Modal */}
//       {isFilterModalOpen && (
//         <div className="fixed inset-0 bg-[#EFEFEF] z-50 lg:hidden">
//           {/* Modal Header */}
//           <div className="flex justify-between items-center p-4 border-b">
//             <div className="text-center flex-1">
//               <h2 className="text-sm font-medium text-gray-900">FILTER AND SORT</h2>
//               <p className="text-xs text-gray-500 mt-1">{productCount} PRODUCTS</p>
//             </div>
//             <button 
//               onClick={closeModal}
//               className="text-2xl text-gray-700 hover:text-gray-900"
//             >
//               ×
//             </button>
//           </div>

//           {/* Modal Content */}
//           <div className="p-6 space-y-8">
//             {/* Size Filter */}
//             <div className="border-b pb-2">
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-xs font-medium text-gray-900">SIZE</h3>
//               </div>
//               <select 
//                 className="w-full p-3 text-xs bg-[#EFEFEF]"
//                 value={tempSize}
//                 onChange={e => setTempSize(e.target.value)}
//               >
//                 <option value="All">All Sizes</option>
//                 <option value="S">100 ml</option>
//               </select>
//             </div>

//             {/* Availability Filter */}
//             <div className="border-b pb-2">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-sm font-medium text-gray-900">AVAILABILITY</h3>
//               </div>
//               <select 
//                 className="w-full p-3 text-xs bg-[#EFEFEF]"
//                 value={tempAvailability}
//                 onChange={e => setTempAvailability(e.target.value)}
//               >
//                 <option value="All">All Items</option>
//                 <option value="InStock">In Stock</option>
//                 <option value="OutOfStock">Out of Stock</option>
//               </select>
//             </div>

//             {/* Sort Options */}
//             <div className="border-b pb-2">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-sm font-medium text-gray-900">SORT BY:</h3>
//               </div>
//               <select 
//                 className="w-full p-3 text-sm bg-[#EFEFEF]"
//                 value={tempSort}
//                 onChange={e => setTempSort(e.target.value)}
//               >
//                 <option value="Featured">Featured</option>
//                 <option value="Price: Low to High">Price: Low to High</option>
//                 <option value="Price: High to Low">Price: High to Low</option>
//                 <option value="Newest">Newest</option>
//               </select>
//             </div>
//           </div>

//           {/* Modal Footer */}
//           <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#EFEFEF] border-t">
//             <div className="flex gap-4">
//               <button 
//                 onClick={removeAllFilters}
//                 className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-medium"
//               >
//                 REMOVE ALL
//               </button>
//               <button 
//                 onClick={applyFilters}
//                 className="flex-1 py-3 bg-black text-white text-sm font-medium"
//               >
//                 APPLY
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MenuBar;

// src/components/MenuBar.jsx
import React, { useState } from "react";

const MenuBar = ({ productCount = 0 }) => {
  const getProductCountSpan = (count) => {
    return (
      <span className="product-count text-gray-700">
        {count} PRODUCTS
      </span>
    );
  };

  const [size, setSize] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSize, setTempSize] = useState(size);
  const [tempAvailability, setTempAvailability] = useState(availability);
  const [tempSort, setTempSort] = useState(sort);

  const applyFilters = () => {
    setSize(tempSize);
    setAvailability(tempAvailability);
    setSort(tempSort);
    setIsFilterModalOpen(false);
  };

  const removeAllFilters = () => {
    setTempSize("All");
    setTempAvailability("All");
    setTempSort("Featured");
  };

  const closeModal = () => {
    setTempSize(size);
    setTempAvailability(availability);
    setTempSort(sort);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="text-xs bg-[#EFEFEF]">
      <div className="relative font-medium text-xs p-5 mt-21 md:px-10 text-gray-900 bg-[#EFEFEF]">ALL PRODUCTS</div>
      <div className="px-10 filter-bar hidden sm:flex bg-[#EFEFEF]">
        <div className="filter-options">
          <div className="filter-group flex justify-between">
            <label className="text-gray-700 text-xs" >
              FILTER:
              <select className="text-gray-700 hover:cursor-pointer" value={size} onChange={e => setSize(e.target.value)}>
                <option className=" hover:cursor-pointer" value="All">Size</option>
                <option className=" hover:cursor-pointer" value="S">100 ml</option>
              </select>
            </label>
            <label>
              <select className="text-gray-700  hover:cursor-pointer" value={availability} onChange={e => setAvailability(e.target.value)}>
                <option value="InStock">In Stock</option>
                <option value="OutOfStock">Out of Stock</option>
              </select>
            </label>
          </div>
        </div>
        <div className="sort-group text-xs">
          <label className="text-gray-700">
            SORT BY:
            <select className="ml-3 text-gray-700  hover:cursor-pointer" value={sort} onChange={e => setSort(e.target.value)}>
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </label>

          {/* call the function and pass a NUMBER, not the function itself */}
          {getProductCountSpan(productCount)}
        </div>
      </div>

      {/* Mobile/Small Screen Filter Button - Fixed at bottom with full width */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 w-full bg-black text-white z-30">
        <button
          className="w-full py-4 text-center text-sm font-medium tracking-wider"
          onClick={() => setIsFilterModalOpen(true)}
        >
          FILTER AND SORT
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-[#EFEFEF] z-50 lg:hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-center flex-1">
              <h2 className="text-sm font-medium text-gray-900">FILTER AND SORT</h2>
              <p className="text-xs text-gray-500 mt-1">{productCount} PRODUCTS</p>
            </div>
            <button
              onClick={closeModal}
              className="text-2xl text-gray-700 hover:text-gray-900"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div className="border-b pb-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-gray-900">SIZE</h3>
              </div>
              <select
                className="w-full p-3 text-xs bg-[#EFEFEF]"
                value={tempSize}
                onChange={e => setTempSize(e.target.value)}
              >
                <option value="All">All Sizes</option>
                <option value="S">100 ml</option>
                <option value="S">200 ml</option>
              </select>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">AVAILABILITY</h3>
              </div>
              <select
                className="w-full p-3 text-xs bg-[#EFEFEF]"
                value={tempAvailability}
                onChange={e => setTempAvailability(e.target.value)}
              >
                <option value="All">All Items</option>
                <option value="InStock">In Stock</option>
                <option value="OutOfStock">Out of Stock</option>
              </select>
            </div>

            <div className="border-b pb-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">SORT BY:</h3>
              </div>
              <select
                className="w-full p-3 text-sm bg-[#EFEFEF]"
                value={tempSort}
                onChange={e => setTempSort(e.target.value)}
              >
                <option value="Featured">Featured</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#EFEFEF] border-t">
            <div className="flex gap-4">
              <button
                onClick={removeAllFilters}
                className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-medium"
              >
                REMOVE ALL
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 bg-black text-white text-sm font-medium"
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
