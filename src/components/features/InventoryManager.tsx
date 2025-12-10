'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Trash2, 
  UploadCloud, 
  X, 
  Loader2,
  Image as ImageIcon,
  Pencil 
} from 'lucide-react';

export default function InventoryManager() {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- STATE FOR EDITING ---
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'vitamins',
    price: '',
    description: '',
    requires_prescription: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  // --- HANDLERS ---

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description || '',
      requires_prescription: product.requires_prescription || false
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'vitamins', price: '', description: '', requires_prescription: false });
    setImageFile(null);
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingProduct?.image_url || null;

      // 1. Upload New Image
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      // 2. Prepare Data
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        requires_prescription: formData.requires_prescription,
        image_url: imageUrl,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);
        if (error) throw error;
        alert('Product updated successfully!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert({ ...payload, stock: 100 });
        if (error) throw error;
        alert('Product added successfully!');
      }

      resetForm();
      fetchProducts();

    } catch (error: any) {
      alert('Error saving product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  // Helper class for dark mode options
  const optionClass = "bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white";

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Inventory</h2>
          <p className="text-gray-500">Manage products and stock.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </header>

      {/* Product List */}
      <div className="bg-white dark:bg-[#0a111d] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 text-xs uppercase font-bold border-b border-gray-200 dark:border-white/5">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Rx Required</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                <td className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/10 relative overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-6 h-6" /></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                </td>
                <td className="p-4 capitalize text-gray-500">{product.category}</td>
                <td className="p-4 font-bold">{formatIDR(product.price)}</td>
                <td className="p-4 text-center">
                  {product.requires_prescription ? (
                    <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200 border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 dark:text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Name</label>
                  <input 
                    required 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" 
                    placeholder="e.g. Vitamin C" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Price (IDR)</label>
                  <input 
                    required 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" 
                    placeholder="e.g. 50000" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                  className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                >
                  <option className={optionClass} value="vitamins">Vitamins</option>
                  <option className={optionClass} value="pain">Pain Relief</option>
                  <option className={optionClass} value="prescription">Prescription (Rx)</option>
                  <option className={optionClass} value="cold">Cold & Flu</option>
                  <option className={optionClass} value="firstaid">First Aid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Description</label>
                <textarea 
                  required 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white" 
                  rows={3} 
                  placeholder="Product details..." 
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                <input 
                  type="checkbox" 
                  name="requires_prescription" 
                  checked={formData.requires_prescription} 
                  onChange={handleInputChange} 
                  className="w-5 h-5 rounded text-blue-600" 
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Requires Doctor's Recipe (Rx)</label>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700 dark:text-gray-300">Product Image</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    {imageFile ? (
                      <span className="text-blue-500 font-bold">{imageFile.name}</span>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 mb-1" />
                        <span className="text-xs">
                          {editingProduct?.image_url ? "Click to change image" : "Click to upload image"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : (editingProduct ? "Update Product" : "Save Product")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}