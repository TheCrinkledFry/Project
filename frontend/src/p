import React, { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageStatus, setImageStatus] = useState({});
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [savedImageUrl, setSavedImageUrl] = useState(""); // Save image URL separately when editing

  const API = "http://localhost:8080"; // Base URL for API

  // Fetch products when the component is mounted
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run once when the component mounts

  // Fetch image to explicitly check if it's available
  const checkImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { method: "HEAD" });
      if (response.ok) {
        return imageUrl;
      }
    } catch (err) {
      console.error("Failed to fetch image:", err);
    }
    return "/assets/placeholder.png"; // Return fallback image if the original image is not found
  };

  // Handle image fetching for each product
  const loadImage = (product) => {
    const fullImageUrl = `${API}${product.image_url}`; // Build full image URL
    if (!imageStatus[product.id]) {
      checkImage(fullImageUrl).then((validImage) => {
        setImageStatus((prevStatus) => ({
          ...prevStatus,
          [product.id]: validImage,
        }));
      });
    }
    return imageStatus[product.id] || "/assets/placeholder.png";
  };

  // Handle form to add a product
  const handleAdd = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      price: parseFloat(form.price.value),
      quantity: parseInt(form.quantity.value, 10),
      available: true,
      imageUrl: form.imageUrl.value.trim(),
    };

    try {
      const response = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const newProd = await response.json();
      setProducts((prev) => [...prev, newProd]);
      form.reset();
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  // Filter products based on search input
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setSavedImageUrl(product.image_url); // Save the image URL for editing
  };

  // Handle update of edited product
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      id: editingProduct.id, // Product ID is required to update the right product
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: parseFloat(form.price.value),
      quantity: parseInt(form.quantity.value, 10),
      discontinued: form.discontinued.value === "yes", // Map "yes" to true, "no" to false
      imageUrl: savedImageUrl, // Ensure the image URL is included
    };

    try {
      const response = await fetch(`${API}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((prod) =>
          prod.id === updatedProduct.id ? updatedProduct : prod,
        ),
      );
      setEditingProduct(null); // Close the form after updating
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  // Render loading state, error message, or the products list
  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "1rem",
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "black", // Black background for cards
    color: "white", // Text color white
  };

  const imgStyle = {
    width: "100%",
    height: "350px",
    objectFit: "cover",
  };

  const cardContentStyle = { padding: "1rem", flexGrow: 1 };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly dark background to make modal stand out
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure overlay is on top
  };

  const modalStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    width: "500px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  // Styled Button component (Inline version)
  function StyledButton({
    children,
    onClick,
    disabled,
    type = "button",
    style: userStyle,
    ...rest
  }) {
    const [hovered, setHovered] = useState(false);
    const baseStyle = {
      padding: "8px 12px",
      background: "white",
      border: "1px solid #007bff",
      borderRadius: "4px",
      color: "#007bff",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontSize: "1rem",
      transition: "background 0.2s, color 0.2s",
      ...userStyle,
    };
    const hoverStyle = disabled
      ? {}
      : {
          background: "#007bff",
          color: "white",
        };
    return (
      <button
        type={type}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={hovered ? { ...baseStyle, ...hoverStyle } : baseStyle}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <div>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: "1rem" }}>
        <input
          name="name"
          placeholder="Name"
          required
          style={{
            padding: "0.5rem",
            width: "300px",
            backgroundColor: "white", // White background for input
            color: "black", // Black text color
          }}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          style={{
            padding: "0.5rem",
            backgroundColor: "white",
            color: "black",
          }}
        />
        <input
          name="quantity"
          type="number"
          placeholder="Qty"
          required
          style={{
            padding: "0.5rem",
            backgroundColor: "white",
            color: "black",
          }}
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          required
          style={{
            padding: "0.5rem",
            backgroundColor: "white",
            color: "black",
          }}
        />
        <StyledButton type="submit">Add Product</StyledButton>
      </form>

      <div style={gridStyle}>
        {filtered.map((product) => {
          const imageUrl = loadImage(product);

          return (
            <div key={product.id} style={cardStyle}>
              <img
                src={imageUrl}
                alt={product.name}
                style={imgStyle}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/placeholder.png"; // Fallback image
                }}
              />
              <div style={cardContentStyle}>
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <p>Stock: {product.quantity}</p>
                {product.quantity === 0 && (
                  <span
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      display: "block",
                      margin: "0.5rem 0",
                    }}
                  >
                    Out of Stock
                  </span>
                )}
                {product.discontinued && (
                  <span
                    style={{
                      color: "white", // White text for discontinued
                      fontWeight: "bold",
                      display: "block",
                      margin: "0.5rem 0",
                    }}
                  >
                    Discontinued
                  </span>
                )}
                {product.description && <p>{product.description}</p>}
              </div>

              <div style={{ padding: "1rem" }}>
                <StyledButton
                  onClick={() => handleEdit(product)}
                  style={{ zIndex: 20 }}
                >
                  Edit
                </StyledButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Editing */}
      {editingProduct && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Edit Product</h3>
            <form onSubmit={handleUpdate}>
              <label htmlFor="name" style={{ color: "black" }}>
                Name:
                <input
                  name="name"
                  id="name"
                  defaultValue={editingProduct.name}
                  placeholder="Name"
                  required
                  style={{
                    padding: "0.5rem",
                    width: "100%",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </label>

              <label htmlFor="price" style={{ color: "black" }}>
                Price:
                <input
                  name="price"
                  id="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct.price}
                  placeholder="Price"
                  required
                  style={{
                    padding: "0.5rem",
                    width: "100%",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </label>

              <label htmlFor="quantity" style={{ color: "black" }}>
                Quantity:
                <input
                  name="quantity"
                  id="quantity"
                  type="number"
                  defaultValue={editingProduct.quantity}
                  placeholder="Quantity"
                  required
                  style={{
                    padding: "0.5rem",
                    width: "100%",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </label>

              <label htmlFor="description" style={{ color: "black" }}>
                Description:
                <textarea
                  name="description"
                  id="description"
                  defaultValue={editingProduct.description}
                  placeholder="Description"
                  style={{
                    padding: "0.5rem",
                    width: "100%",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              </label>

              <label htmlFor="discontinued" style={{ color: "black" }}>
                Discontinued:
                <select
                  name="discontinued"
                  id="discontinued"
                  value={editingProduct.discontinued ? "yes" : "no"}
                  onChange={(e) => {
                    setEditingProduct((prev) => ({
                      ...prev,
                      discontinued: e.target.value === "yes",
                    }));
                  }}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>

              <div style={{ marginTop: "1rem" }}>
                <StyledButton type="submit">Update</StyledButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
