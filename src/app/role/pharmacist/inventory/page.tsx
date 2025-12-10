import InventoryManager from '@/components/features/InventoryManager';

export default function PharmacistInventoryPage() {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg text-sm text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20">
        Staff Mode: You can manage stock, but cannot delete audit logs.
      </div>
      <InventoryManager />
    </div>
  );
}