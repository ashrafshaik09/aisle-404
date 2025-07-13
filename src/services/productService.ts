import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type DbProduct = Tables<'products'>;
export type DbProductInsert = TablesInsert<'products'>;

// Transform database product to app product model
export const transformDbProductToAppProduct = (dbProduct: DbProduct) => {
  return {
    id: dbProduct.productid,
    productId: dbProduct.productid,
    name: dbProduct.name,
    category: dbProduct.category || 'Uncategorized',
    description: 'Product description', // Default since not in DB
    price: dbProduct.price || 0,
    mrp: dbProduct.mrp || dbProduct.price || 0,
    discount: dbProduct.discount || 0,
    stock: dbProduct.stockcount || 0,
    aisleLocation: dbProduct.location || 'A1',
    batchNumber: dbProduct.batchnumber || '',
    expiryDate: dbProduct.expirydate || '',
    isEcoFriendly: false, // Default since not in DB
    isOnPromotion: dbProduct.isonpromotion || false,
    isNearExpiry: dbProduct.expirydate 
      ? new Date(dbProduct.expirydate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      : false,
    averageRating: 4.0, // Default rating until we implement ratings
    reviews: [],
    qrCode: '',
    qrLink: dbProduct.qrlink || '',
    salesVelocity: dbProduct.salesvelocity || 1,
    createdAt: dbProduct.lastupdated || new Date().toISOString(),
    updatedAt: dbProduct.lastupdated || new Date().toISOString()
  };
};

// Fetch all products
export const fetchAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data.map(transformDbProductToAppProduct);
  } catch (error) {
    console.error('Error in fetchAllProducts:', error);
    return [];
  }
};

// Fetch a single product by ID
export const fetchProductById = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('productid', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return transformDbProductToAppProduct(data);
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};

// Create a new product
export const createProduct = async (product: DbProductInsert) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return transformDbProductToAppProduct(data[0]);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (productId: string, updates: Partial<DbProduct>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('productid', productId)
      .select();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return transformDbProductToAppProduct(data[0]);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (productId: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('productid', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
};

// Search products
export const searchProducts = async (
  searchTerm: string = '', 
  category: string = 'all',
  sortBy: string = 'name'
) => {
  try {
    let query = supabase
      .from('products')
      .select('*');

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
    }
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    // Transform database results to app product model
    const products = data.map(transformDbProductToAppProduct);
    
    // Apply sorting
    return sortProducts(products, sortBy);
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};

// Helper function for sorting products
const sortProducts = (products: any[], sortBy: string) => {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'discount':
        return b.discount - a.discount;
      default:
        return a.name.localeCompare(b.name);
    }
  });
};

// Update product view count
export const incrementProductViewCount = async (productId: string) => {
  try {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('viewcount')
      .eq('productid', productId)
      .single();

    if (fetchError) {
      console.error('Error fetching product view count:', fetchError);
      return;
    }

    const newViewCount = (product.viewcount || 0) + 1;

    const { error: updateError } = await supabase
      .from('products')
      .update({ viewcount: newViewCount })
      .eq('productid', productId);

    if (updateError) {
      console.error('Error updating product view count:', updateError);
    }
  } catch (error) {
    console.error('Error in incrementProductViewCount:', error);
  }
};

// Update product cart add count
export const incrementProductCartCount = async (productId: string) => {
  try {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('cartaddcount')
      .eq('productid', productId)
      .single();

    if (fetchError) {
      console.error('Error fetching product cart count:', fetchError);
      return;
    }

    const newCartCount = (product.cartaddcount || 0) + 1;

    const { error: updateError } = await supabase
      .from('products')
      .update({ cartaddcount: newCartCount })
      .eq('productid', productId);

    if (updateError) {
      console.error('Error updating product cart count:', updateError);
    }
  } catch (error) {
    console.error('Error in incrementProductCartCount:', error);
  }
};
