import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Fetch products from API
  useEffect(() => {
    fetch("http://localhost:8080/products") // Change the API endpoint accordingly
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  // Filter products by search input
  let filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Sorting logic
  if (sort === "price") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "availability") {
    filtered = [...filtered].sort((a, b) => {
      if (a.quantity > 0 !== b.quantity > 0) {
        return a.quantity > 0 ? -1 : 1;
      }
      return b.quantity - a.quantity;
    });
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "32px" }}>
      {/* Search and Sort */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "12px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="">Sort...</option>
          <option value="price">Sort by Price</option>
          <option value="availability">Sort by Availability</option>
        </select>
      </div>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "32px",
        }}
      >
        {filtered.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            {/* Product Image */}
            <div
              style={{
                width: "100%",
                height: "200px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              <img
                src={`http://localhost:8080/productImages/${p.name
                  .toLowerCase()
                  .replaceAll(" ", "_")}.png`}
                alt={p.name}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "http://localhost:8080/productImages/placeholder.png"; // fallback image
                }}
              />
            </div>

            {/* Product Details */}
            <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{p.name}</p>
            <p style={{ color: "#777", margin: "8px 0" }}>{p.description}</p>
            <p style={{ fontWeight: "bold", margin: "8px 0" }}>
              ${p.price.toFixed(2)}
            </p>
            <p
              style={{
                color: p.quantity > 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {p.quantity > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <p
              style={{ marginTop: "16px", color: "#007bff", cursor: "pointer" }}
            >
              View Details
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
//
// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("");
//
//   useEffect(() => {
//     fetch("http://localhost:8080/products") // Change if API path or proxy is different
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch products");
//         return res.json();
//       })
//       .then((data) => setProducts(data))
//       .catch((err) => console.error("Failed to fetch products:", err));
//   }, []);
//
//   let filtered = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase()),
//   );
//
//   if (sort === "price") {
//     filtered = [...filtered].sort((a, b) => a.price - b.price);
//   } else if (sort === "availability") {
//     filtered = [...filtered].sort((a, b) => {
//       if (a.quantity > 0 !== b.quantity > 0) {
//         return a.quantity > 0 ? -1 : 1;
//       }
//       return b.quantity - a.quantity;
//     });
//   }
//
//   return (
//     <div style={{ fontFamily: "sans-serif", padding: "32px" }}>
//       <div style={{ marginBottom: "24px", display: "flex", gap: "12px" }}>
//         <input
//           type="text"
//           placeholder="Search by name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ padding: "8px", flex: 1 }}
//         />
//         <select
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           style={{ padding: "8px" }}
//         >
//           <option value="">Sort...</option>
//           <option value="price">Sort by Price</option>
//           <option value="availability">Sort by Availability</option>
//         </select>
//       </div>
//
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//           gap: "32px",
//         }}
//       >
//         {filtered.map((p) => (
//           <div
//             key={p.id}
//             style={{
//               textAlign: "center",
//               border: "1px solid #ccc",
//               padding: "24px",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 width: "100%",
//                 height: "220px",
//                 position: "relative",
//                 overflow: "hidden",
//                 borderRadius: "4px",
//               }}
//             >
//               <img
//                 src={`/productImages/${p.name
//                   .toLowerCase()
//                   .replaceAll(" ", "_")}.png`}
//                 alt={p.name}
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   maxWidth: "100%",
//                   maxHeight: "100%",
//                 }}
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "/placeholder.png"; // fallback image if missing
//                 }}
//               />
//             </div>
//
//             <p
//               style={{
//                 marginTop: "16px",
//                 fontWeight: "bold",
//                 fontSize: "1.2rem",
//               }}
//             >
//               {p.name}
//             </p>
//             <p style={{ margin: "12px 0" }}>${p.price.toFixed(2)}</p>
//             <p style={{ marginBottom: "8px" }}>Quantity: {p.quantity}</p>
//             <p style={{ color: p.quantity > 0 ? "green" : "red", margin: 0 }}>
//               {p.quantity > 0 ? "In stock" : "Out of stock"}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
