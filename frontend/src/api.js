const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080"; // Set API URL

// Fetch products from the Go API using fetch
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json(); // Parse and return the product data
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Create a new product via the Go API using fetch
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData), // Convert product data to JSON
    });
    if (!response.ok) {
      throw new Error("Failed to create product");
    }
    return await response.json(); // Return the newly created product
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product via the Go API using fetch
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData), // Convert updated data to JSON
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    return await response.json(); // Return the updated product
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
