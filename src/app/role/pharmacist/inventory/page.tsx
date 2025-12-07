'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Plus, Search, Trash2, UploadCloud, X, Loader2, Image as ImageIcon, Pencil } from 'lucide-react';

export default function InventoryPage() {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', category: 'vitamins', price: '', description: '', requires_prescription: false
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

  // --- FORM HANDLERS ---
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingProduct?.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        requires_prescription: formData.requires_prescription,
        image_url: imageUrl,
      };

      if (editingProduct) {
        await supabase.from('products').update(payload).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert({ ...payload, stock: 100 });
      }

      alert('Inventory updated successfully!');
      resetForm();
      fetchProducts();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Update stock levels and add new medicines.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-500/30"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-[#0a111d] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 text-xs uppercase font-bold border-b border-gray-200 dark:border-white/5">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Rx</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading inventory...</td></tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                <td className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 relative overflow-hidden flex-shrink-0">
                    {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" /> : <ImageIcon className="w-5 h-5 m-auto text-gray-400" />}
                  </div>
                  <span className="font-medium">{product.name}</span>
                </td>
                <td className="p-4 capitalize text-gray-500">{product.category}</td>
                <td className="p-4 font-bold">{formatIDR(product.price)}</td>
                <td className="p-4 text-center">{product.requires_prescription ? <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">Yes</span> : '-'}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" placeholder="Product Name" />
              <input required type="number" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" placeholder="Price (IDR)" />
              <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <option value="vitamins">Vitamins</option>
                  <option value="pain">Pain Relief</option>
                  <option value="prescription">Prescription (Rx)</option>
                  <option value="cold">Cold & Flu</option>
                  <option value="firstaid">First Aid</option>
              </select>
              <textarea required name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10" placeholder="Description..." />
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                <input type="checkbox" checked={formData.requires_prescription} onChange={(e) => setFormData({...formData, requires_prescription: e.target.checked})} className="w-5 h-5 rounded text-blue-600" />
                <label className="text-sm font-medium">Requires Prescription</label>
              </div>
              <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    {imageFile ? <span className="text-blue-500 font-bold">{imageFile.name}</span> : <><UploadCloud className="w-6 h-6 mb-1" /><span className="text-xs">Upload Image</span></>}
                  </div>
              </div>
              <button type="submit" disabled={uploading} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
                {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}