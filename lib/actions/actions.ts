const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.text(); // Parse lỗi từ response
    throw new Error(`API Error: ${res.status} - ${error}`);
  }
  return await res.json();
};

export const getCollections = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`);
  return handleResponse(res);
};

export const getCollectionDetails = async (collectionId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`);
  return handleResponse(res);
};

export const getProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  return handleResponse(res);
};

export const getProductDetails = async (productId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
    method: 'GET',
    credentials: 'include', // Gửi cookie cùng với request
  });

  if (!res.ok) {
    console.error(`Failed to fetch product ${productId}: ${res.status} - ${res.statusText}`);
    throw new Error('Failed to fetch product details');
  }

  return handleResponse(res);
};


export const getSearchedProducts = async (query: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${query}`);
  return handleResponse(res);
};

export const getOrders = async (customerId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`);
  return handleResponse(res);
};

export const getRelatedProducts = async (productId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`);
  return handleResponse(res);
};
